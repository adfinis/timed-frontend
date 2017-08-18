/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import service from 'ember-service/inject'
import RSVP from 'rsvp'
import hbs from 'htmlbars-inline-precompile'
import { typeOf } from 'ember-utils'
import customerTemplate from '../../customer-suggestion/template'

const FORMAT = obj => (typeOf(obj) === 'instance' ? obj.get('name') : '')

const regexFilter = (data, term, key) => {
  let re = new RegExp(`.*${term}.*`, 'i')

  return data.filter(i => re.test(i.get(key)))
}

/**
 * Component for selecting a task, which consists of selecting a customer and
 * project first.
 *
 * @class TaskSelectionComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * HTML tag name for the component
   *
   * This is an empty string, so we don't have an element of this component in
   * the DOM
   *
   * @property {String} tagName
   * @public
   */
  tagName: '',

  /**
   * Tracking service
   *
   * This service delivers the tasks to fetch the needed data, so we don't have
   * to pass them to the component every time.
   *
   * @property {TrackingService} tracking
   * @public
   */
  tracking: service('tracking'),

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  archived: false,

  /**
   * The limit of search results
   *
   * @property {Number} limit
   * @public
   */
  limit: Number.MAX_SAFE_INTEGER,

  /**
   * Display function for the autocomplete component
   *
   * @property {Function} display
   * @public
   */
  display: FORMAT,

  /**
   * Transform selection function for the autocomplete component
   *
   * @property {Function} transformSelection
   * @public
   */
  transformSelection: FORMAT,

  /**
   * Template for displaying the suggestions
   *
   * @property {*} suggestionTemplate
   * @public
   */
  suggestionTemplate: hbs`{{model.name}}`,

  customerTemplate,

  /**
   * The manually selected customer
   *
   * @property {Customer} _customer
   * @private
   */
  _customer: null,

  /**
   * The manually selected project
   *
   * @property {Project} _project
   * @private
   */
  _project: null,

  /**
   * Whether to show history entries in the customer selection or not
   *
   * @property {Boolean} history
   * @public
   */
  history: true,

  /**
   * The selected customer
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Customer} customer
   * @public
   */
  @computed('task')
  customer: {
    get(task) {
      return (task && task.get('project.customer')) || this.get('_customer')
    },
    set(value) {
      /**
       * It is also possible a task was selected from the history.
       */
      if (value && value.get('constructor.modelName') === 'task') {
        this.set('task', value)
        this.set('_project', value.get('project'))
        this.set('_customer', value.get('project.customer'))

        return this.get('_customer')
      }

      this.set('_customer', value)

      /* istanbul ignore else */
      if (!value || value.get('id') !== this.get('project.customer.id')) {
        this.set('project', null)
      }

      /* istanbul ignore else */
      if (value) {
        this.get('tracking.filterProjects').perform(value.get('id'))
      }

      return value
    }
  },

  /**
   * The selected project
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Project} project
   * @public
   */
  @computed('task')
  project: {
    get(task) {
      return (task && task.get('project')) || this.get('_project')
    },
    set(value) {
      this.set('_project', value)

      /* istanbul ignore else */
      if (value === null || value.get('id') !== this.get('task.project.id')) {
        this.set('task', null)
      }

      /* istanbul ignore else */
      if (value) {
        this.get('tracking.filterTasks').perform(value.get('id'))
      }

      return value
    }
  },

  /**
   * Source function for the customer autocomplete component
   *
   * Creates a list starting with the recent history of activities or reports
   * and following with all customers.
   *
   * This either takes the last fetched data and filters them, or triggers
   * the call first if none was triggered before.
   *
   * @property {Function} customerSource
   * @public
   */
  @computed('history')
  customerSource(history) {
    return (search, syncResults, asyncResults) => {
      let fnCustomer = this.get('tracking.filterCustomers')
      let customers =
        fnCustomer.get('last') || fnCustomer.perform(this.get('archived'))

      let requests = { customers }

      if (history) {
        let fnHistory = this.get('tracking.recentTasks')
        requests.history =
          fnHistory.get('last') || fnHistory.perform(this.get('archived'))
      }

      /* istanbul ignore next */
      RSVP.hash(requests)
        .then(hash => {
          let data = [...regexFilter(hash.customers.toArray(), search, 'name')]

          if (history) {
            data = [
              ...regexFilter(hash.history.toArray(), search, 'longName'),
              ...data
            ]
          }
          asyncResults(data)
        })
        .catch(() => asyncResults([]))
    }
  },

  /**
   * Source function for the project autocomplete component
   *
   * This either takes the last fetched projects and filters them, or triggers
   * the call first if none was triggered before.
   *
   * @property {Function} projectSource
   * @public
   */
  @computed
  projectSource() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('tracking.filterProjects')

      let projects =
        fn.get('last') ||
        fn.perform(this.get('customer.id'), this.get('archived'))

      /* istanbul ignore next */
      projects
        .then(data => asyncResults(regexFilter(data, search, 'name')))
        .catch(() => asyncResults([]))
    }
  },

  /**
   * Source function for the task autocomplete component
   *
   * This either takes the last fetched projects and filters them, or triggers
   * the call first if none was triggered before.
   *
   * @property {Function} taskSource
   * @public
   */
  @computed
  taskSource() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('tracking.filterTasks')

      let tasks =
        fn.get('last') ||
        fn.perform(this.get('project.id'), this.get('archived'))

      /* istanbul ignore next */
      tasks
        .then(data => asyncResults(regexFilter(data, search, 'name')))
        .catch(() => asyncResults([]))
    }
  }
})
