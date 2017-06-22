/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route                   from 'ember-route'
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'

/**
 * The protected route
 *
 * @class ProtectedRoute
 * @extends Ember.Route
 * @uses EmberSimpleAuth.AuthenticatedRouteMixin
 * @public
 */
export default Route.extend(AuthenticatedRouteMixin, {
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
    loading(transition) {
      let controller = this.get('controller')

      if (controller) {
        controller.set('loading', true)
      }

      if (transition) {
        transition.promise.finally(() => {
          this.send('finished')
        })
      }
    },

    /**
     * Finish the loading animation
     *
     * @method finished
     * @public
     */
    finished() {
      let controller = this.get('controller')

      if (controller) {
        controller.set('loading', false)
      }
    }
  }
})
