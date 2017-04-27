/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component           from 'ember-component'
import computed, { alias } from 'ember-computed-decorators'

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
   * Whether the task selection has errors
   *
   * This is either null or an object containing the error messages.
   *
   * @property {*} error
   * @public
   */
  error: null,

  /**
   * Set the customer and project when we set a task
   *
   * @method didReceiveAttrs
   * @public
   */
  didReceiveAttrs() {
    this._super(...arguments)

    let task = this.get('task.id') ? this.get('task') : null

    if (task) {
      this.set('_customer', task.get('project.customer'))
      this.set('_project', task.get('project'))
    }
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
   * @property {Task} task
   * @public
   */
  task: null,

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

      if (this.get('task.content')) {
        this.get('attrs.on-change')(null)
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

      if (this.get('task.content')) {
        this.get('attrs.on-change')(null)
      }

      return value
    }
  },

  /**
   * All available customers
   *
   * @property {Customer[]} customers
   * @public
   */
  customers: [],

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
   * All available customers
   *
   * @property {Customer[]} _customers
   * @private
   */
  @alias('customers')
  _customers: null,

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

  /**
   * The actions of the task selection component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Change action
     *
     * This is triggered when the task is selected, not when the customer or
     * project is selected
     *
     * @method change
     * @param {Task} task The selected task
     * @public
     */
    change(task) {
      this.get('attrs.on-change')(task)
    }
  }
})
