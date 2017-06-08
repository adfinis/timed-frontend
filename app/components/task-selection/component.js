/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component  from 'ember-component'
import computed   from 'ember-computed-decorators'
import service    from 'ember-service/inject'
import hbs        from 'htmlbars-inline-precompile'
import { typeOf } from 'ember-utils'

const FORMAT = (obj) => typeOf(obj) === 'instance' ? obj.get('name') : ''
const SUGGESTION_TEMPLATE = hbs`{{model.name}}`

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

  tracking: service('tracking'),

  limit: Infinity,

  display: FORMAT,

  transformSelection: FORMAT,

  suggestionTemplate: SUGGESTION_TEMPLATE,

  _customer: null,
  _project: null,

  @computed('task')
  customer: {
    get(task) {
      return task && task.get('project.customer') || this.get('_customer')
    },
    set(task, value) {
      this.set('_customer', value)

      /* istanbul ignore else */
      if (value === null || value.get('id') !== this.get('project.customer.id')) {
        this.set('project', null)
      }

      /* istanbul ignore else */
      if (value) {
        this.get('tracking.filterProjects').perform(value.get('id'))
      }

      return value
    }
  },

  @computed('task')
  project: {
    get(task) {
      return task && task.get('project') || this.get('_project')
    },
    set(task, value) {
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

  @computed
  customerSource() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('tracking.filterCustomers')

      let customers = fn.get('last') || fn.perform()

      /* istanbul ignore next */
      customers
        .then((data) => {
          let re = new RegExp(`.*${search}.*`, 'i')

          return asyncResults(data.filter((i) => re.test(i.get('name'))))
        })
        .catch(() => {
          return asyncResults([])
        })
    }
  },

  @computed
  projectSource() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('tracking.filterProjects')

      let projects = fn.get('last') || fn.perform(this.get('customer.id'))

      /* istanbul ignore next */
      projects
        .then((data) => {
          let re = new RegExp(`.*${search}.*`, 'i')

          return asyncResults(data.filter((i) => re.test(i.get('name'))))
        })
        .catch(() => {
          return asyncResults([])
        })
    }
  },

  @computed
  taskSource() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('tracking.filterTasks')

      let tasks = fn.get('last') || fn.perform(this.get('project.id'))

      /* istanbul ignore next */
      tasks
        .then((data) => {
          let re = new RegExp(`.*${search}.*`, 'i')

          return asyncResults(data.filter((i) => re.test(i.get('name'))))
        })
        .catch(() => {
          return asyncResults([])
        })
    }
  }
})
