/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'

import computed, {
  alias
} from 'ember-computed-decorators'

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
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
   * The currently selected customer
   *
   * This is either the customer related to the activity's task's project's
   * customer or the customer selected in the dropdown
   *
   * By setting this, you reset the project automatically
   *
   * @property {Customer} customer
   * @public
   */
  /* eslint-disable ember/avoid-leaking-state-in-components */
  /* eslint-disable object-literal-jsdoc/obj-doc */
  @computed('activity.task')
  customer: {
    get(task) {
      if (task) {
        return task.get('project.customer')
      }

      return this.get('_customer')
    },
    set(value) {
      this.set('_customer', value)
      this.set('_project', null)

      return value
    }
  },
  /* eslint-enable ember/avoid-leaking-state-in-components */
  /* eslint-enable object-literal-jsdoc/obj-doc */

  /**
   * The currently selected project
   *
   * This is either the customer related to the activity's task's project
   * or the project selected in the dropdown
   *
   * @property {Project} project
   * @public
   */
  /* eslint-disable ember/avoid-leaking-state-in-components */
  /* eslint-disable object-literal-jsdoc/obj-doc */
  @computed('activity.task')
  project: {
    get(task) {
      if (task) {
        return task.get('project')
      }

      return this.get('_project')
    },
    set(value) {
      this.set('_project', value)

      return value
    }
  },
  /* eslint-enable ember/avoid-leaking-state-in-components */
  /* eslint-enable object-literal-jsdoc/obj-doc */

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  @alias('activity.task')
  task: null,

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
   * Whether the bar is ready to start tracking
   *
   * @property {Boolean} ready
   * @public
   */
  @computed('activity.task')
  ready(task) {
    return Boolean(task && task.get('content'))
  },

  /**
   * Whether the bar is currently recording
   *
   * @property {Boolean} recording
   * @public
   */
  @computed('ready', 'activity.active')
  recording(ready, active) {
    return ready && active
  },

  /**
   * Whether the bar is currently paused
   *
   * @property {Boolean} paused
   * @public
   */
  @computed('ready', 'activity.isNew')
  paused(ready, isNew) {
    return ready && !isNew
  },

  /**
   * The actions for the tracking bar component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Start tracking the activity
     *
     * @method start
     * @public
     */
    start() {
      this.get('attrs.on-start')(this.get('activity'))
    },

    /**
     * Pause tracking the activity
     *
     * @method pause
     * @public
     */
    pause() {
      this.get('attrs.on-pause')(this.get('activity'))
    },

    /**
     * Stop tracking the activity
     *
     * @method stop
     * @public
     */
    stop() {
      this.get('attrs.on-stop')(this.get('activity'))
    }
  }
})
