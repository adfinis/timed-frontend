/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin      from 'ember-metal/mixin'
import computedFn from 'ember-computed'

/**
 * Mixin which provides all actions and data for a route using the task
 * selection component.
 *
 * @class TaskSelectionRouteMixin
 * @extends Ember.Mixin
 * @public
 */
export default Mixin.create({
  /**
   * Setup controller hook, set projects and tasks
   *
   * @method setupController
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller) {
    this._super(...arguments)

    controller.set('projects', computedFn(function() {
      return this.store.peekAll('project')
    }))

    controller.set('tasks', computedFn(function() {
      return this.store.peekAll('task')
    }))
  },

  /**
   * Actions for the task selection route mixin
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Search the customers by a term
     *
     * @method searchCustomers
     * @param {String} search The search term
     * @return {Customer[]} The customers matching the search term
     * @public
     */
    searchCustomers(search) {
      return this.store.query('customer', { search })
    },

    /**
     * Filter the projects by customer
     *
     * @method filterProjects
     * @param {Object} filters The filter options
     * @param {Number} filters.customer The customer id
     * @public
     */
    filterProjects(filters) {
      this.store.query('project', filters)
    },

    /**
     * Filter the tasks by project
     *
     * @method filterTasks
     * @param {Object} filters The filter options
     * @param {Number} filters.project The project id
     * @public
     */
    filterTasks(filters) {
      this.store.query('task', filters)
    }
  }
})
