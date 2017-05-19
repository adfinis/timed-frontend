/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component         from 'ember-component'
import computed          from 'ember-computed-decorators'
import { task, timeout } from 'ember-concurrency'

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
   * Whether to show labels above the select boxes
   *
   * @property {Boolean} showLabels
   * @public
   */
  showLabels: false,

  /**
   * Whether to mark the task as required field
   *
   * @property {Boolean} required
   * @public
   */
  required: true,

  /**
   * Whether the task selection has errors
   *
   * This is either null or an object containing the error messages.
   *
   * @property {*} error
   * @public
   */
  error: null,

  init() {
    this._super(...arguments)

    this.set('_customer', this.getWithDefault('_task.project.customer', null))
    this.set('_project',  this.getWithDefault('_task.project', null))
  },

  /**
   * The selected (by dropdown) customer
   *
   * @property {String} _customer
   * @private
   */
  _customer: null,

  /**
   * The selected (by dropdown) project
   *
   * @property {String} _project
   * @private
   */
  _project: null,

  /**
   * The currently selected task
   *
   * @property {Task} _task
   * @private
   */
  _task: null,

  /**
   * The currently selected customer
   *
   * This is either the customer related to the tasks project or the customer
   * selected in the dropdown
   *
   * By setting this, you reset the project automatically
   *
   * @property {Customer} customer
   * @public
   */
  @computed('task')
  customer: {
    get(task) {
      if (task && task.get('content')) {
        return task.get('project.customer')
      }

      return this.get('_customer')
    },
    set(task, value) {
      this.set('_customer', value)

      this.set('project', null)

      if (value) {
        this.get('attrs.on-filter-projects')({ customer: value.id })
      }

      return value
    }
  },

  /**
   * The currently selected project
   *
   * This is either the project related to the task or the project selected in
   * the dropdown
   *
   * @property {Project} project
   * @public
   */
  @computed('task')
  project: {
    get(task) {
      if (task && task.get('content')) {
        return task.get('project')
      }

      return this.get('_project')
    },
    set(task, value) {
      this.set('_project', value)

      this.set('_task', null)

      if (value) {
        this.get('attrs.on-filter-tasks')({ project: value.id })
      }

      return value
    }
  },

  @computed('_task')
  task: {
    get(task) {
      return task
    },
    set(task, value) {
      this.set('_task', value)

      if (!value) {
        this.set('_customer', null)
        this.set('_project',  null)
      }

      return value
    }
  },

  /**
   * All available projects
   *
   * @property {Project[]} projects
   * @public
   */
  projects: [],

  /**
   * All available tasks
   *
   * @property {Task[]} task
   * @public
   */
  tasks: [],

  /**
   * All available projects filtered by the currently selected customer
   *
   * @property {Project[]} _projects
   * @private
   */
  @computed('projects.[]', 'customer.id')
  _projects(projects, id) {
    if (!id) {
      return []
    }

    return projects.filterBy('customer.id', id)
  },

  /**
   * All available tasks filtered by the currently selected project
   *
   * @property {Task[]} _tasks
   * @private
   */
  @computed('tasks.[]', 'project.id')
  _tasks(tasks, id) {
    if (!id) {
      return []
    }

    return tasks.filterBy('project.id', id)
  },

  searchCustomers: task(function* (search) {
    if (!search || search.length < 3) {
      return []
    }

    yield timeout(500)

    return this.get('attrs.on-search-customers')(search)
  }).restartable()
})
