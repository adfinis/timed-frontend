/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import service from 'ember-service/inject'
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
  tracking: service('tracking'),

  session: service('session'),

  beforeModel() {
    // trigger the init function of the tracking service which starts the
    // computed title
    this.get('tracking')
  },

  model() {
    let id = this.get('session.data.authenticated.user_id')

    return this.store.findRecord('user', id, {
      include: 'employments,employments.location'
    })
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
