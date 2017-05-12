/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route                   from 'ember-route'
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'
import TaskSelectionRouteMixin from 'timed/mixins/task-selection-route'

/**
 * The protected route
 *
 * @class ProtectedRoute
 * @extends Ember.Route
 * @uses EmberSimpleAuth.AuthenticatedRouteMixin
 * @public
 */
export default Route.extend(AuthenticatedRouteMixin, TaskSelectionRouteMixin, {
  /**
   * Model hook, fetch the current activity
   *
   * @method model
   * @return {Activity} The currently active activity
   * @public
   */
  async model() {
    let activeActivities = await this.store.query('activity', { include: 'blocks', active: true })

    return activeActivities.getWithDefault('firstObject', null)
  },

  /**
   * Setup controller hook, set the current activity or create a new one if
   * none is active
   *
   * @method setupController
   * @param {ProtectedController} controller The controller
   * @param {Activity|null} model The active activity
   * @public
   */
  setupController(controller, model) {
    this._super(...arguments)

    if (model) {
      controller.set('currentActivity', model)
    }
    else {
      controller.set('currentActivity', this.store.createRecord('activity'))
    }
  },

  /**
   * Actions for the protected route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Loading action
     *
     * Set loading property on the controller
     *
     * @method loading
     * @param {Ember.Transition} transition The transition which is loading
     * @public
     */
    async loading(transition) {
      let controller = this.get('controller')

      if (controller) {
        try {
          controller.set('loading', true)

          await transition.promise
        }
        finally {
          controller.set('loading', false)
        }
      }
    }
  }
})
