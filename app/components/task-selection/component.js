/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import service from 'ember-service/inject'
import hbs from 'htmlbars-inline-precompile'
import { later } from 'ember-runloop'
import customerOptionTemplate from 'timed/templates/customer-option'
import projectOptionTemplate from 'timed/templates/project-option'
import taskOptionTemplate from 'timed/templates/task-option'

const SELECTED_TEMPLATE = hbs`{{selected.name}}`

/**
 * Component for selecting a task, which consists of selecting a customer and
 * project first.
 *
 * @class TaskSelectionComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  store: service('store'),
  tracking: service('tracking'),

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
   * Init hook, initially load customers and recent tasks
   *
   * @method init
   * @public
   */
  async init() {
    this._super(...arguments)

    try {
      await this.get('tracking.customers').perform()
      await this.get('tracking.recentTasks').perform()
    } catch (e) {
      /* istanbul ignore next */
      if (e.taskInstance && e.taskInstance.isCanceling) {
        return
      }

      /* istanbul ignore next */
      throw e
    }
  },

  /**
   * Set the initial values when receiving the attributes
   *
   * @method didReceiveAttrs
   * @return {Task|Project|Customer} The setted task, project or customer
   * @public
   */
  async didReceiveAttrs() {
    this._super(...arguments)

    let { customer, project, task } = this.getWithDefault('initial', {
      customer: null,
      project: null,
      task: null
    })

    if (task && !this.get('task')) {
      return this.set('task', task)
    }

    if (project && !this.get('project')) {
      return this.set('project', project)
    }

    if (customer && !this.get('customer')) {
      return this.set('customer', customer)
    }
  },

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  archived: false,

  /**
   * Template for displaying the customer options
   *
   * @property {*} customerOptionTemplate
   * @public
   */
  customerOptionTemplate,

  /**
   * Template for displaying the project options
   *
   * @property {*} projectOptionTemplate
   * @public
   */
  projectOptionTemplate,

  /**
   * Template for displaying the task options
   *
   * @property {*} taskOptionTemplate
   * @public
   */
  taskOptionTemplate,

  /**
   * Template for displaying the selected option
   *
   * @property {*} selectedTemplate
   * @public
   */
  selectedTemplate: SELECTED_TEMPLATE,

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
   * The manually selected task
   *
   * @property {Task} _task
   * @private
   */
  _task: null,

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
  @computed('_customer')
  customer: {
    get(customer) {
      return customer
    },
    set(value) {
      // It is also possible a task was selected from the history.
      if (value && value.get('constructor.modelName') === 'task') {
        this.set('task', value)

        return value.get('project.customer')
      }

      this.set('_customer', value)

      /* istanbul ignore else */
      if (
        this.get('project') &&
        (!value || value.get('id') !== this.get('project.customer.id'))
      ) {
        this.set('project', null)
      }

      later(this, () => {
        this.getWithDefault('attrs.on-set-customer', () => {})(value)
      })

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
  @computed('_project')
  project: {
    get(project) {
      return project
    },
    set(value) {
      this.set('_project', value)

      if (value && value.get('customer')) {
        this.set('_customer', value.get('customer'))
      }

      /* istanbul ignore else */
      if (
        this.get('task') &&
        (value === null || value.get('id') !== this.get('task.project.id'))
      ) {
        this.set('task', null)
      }

      later(this, () => {
        this.getWithDefault('attrs.on-set-project', () => {})(value)
      })

      return value
    }
  },

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  @computed('_task')
  task: {
    get(task) {
      return task
    },
    set(value) {
      this.set('_task', value)

      if (value && value.get('project')) {
        this.setProperties({
          _project: value.get('project'),
          _customer: value.get('project.customer')
        })
      }

      later(this, () => {
        this.getWithDefault('attrs.on-set-task', () => {})(value)
      })

      return value
    }
  },

  /**
   * All customers and recent tasks which are selectable in the dropdown
   *
   * @property {Array} customersAndRecentTasks
   * @public
   */
  @computed('history', 'archived')
  async customersAndRecentTasks(history, archived) {
    let ids = []

    await this.get('tracking.customers.last')

    if (history) {
      await this.get('tracking.recentTasks.last')

      let last = this.get('tracking.recentTasks.last.value')

      ids = last ? last.mapBy('id') : []
    }

    let customers = this.get('store')
      .peekAll('customer')
      .filter(c => {
        return archived ? true : !c.get('archived')
      })
      .sortBy('name')

    let tasks = this.get('store')
      .peekAll('task')
      .filter(t => {
        return (
          ids.includes(t.get('id')) && (archived ? true : !t.get('archived'))
        )
      })

    return [...tasks.toArray(), ...customers.toArray()]
  },

  /**
   * All projects which are selectable in the dropdown
   *
   * Those depend on the selected customer
   *
   * @property {Project[]} projects
   * @public
   */
  @computed('customer.id', 'archived')
  async projects(id, archived) {
    if (id) {
      await this.get('tracking.projects').perform(id)
    }

    return this.get('store')
      .peekAll('project')
      .filter(p => {
        return (
          p.get('customer.id') === id && (archived ? true : !p.get('archived'))
        )
      })
      .sortBy('name')
  },

  /**
   * All tasks which are selectable in the dropdown
   *
   * Those depend on the selected project
   *
   * @property {Task[]} tasks
   * @public
   */
  @computed('project.id', 'archived')
  async tasks(id, archived) {
    if (id) {
      await this.get('tracking.tasks').perform(id)
    }

    return this.get('store')
      .peekAll('task')
      .filter(t => {
        return (
          t.get('project.id') === id && (archived ? true : !t.get('archived'))
        )
      })
      .sortBy('name')
  },

  actions: {
    /**
     * Clear all comboboxes
     *
     * @method clear
     * @public
     */
    clear() {
      this.setProperties({
        customer: null,
        project: null,
        task: null
      })
    }
  }
})
