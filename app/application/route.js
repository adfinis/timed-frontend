/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route                 from 'ember-route'
import service               from 'ember-service/inject'
import $                     from 'jquery'
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin'

/**
 * The application route
 *
 * @class ApplicationRoute
 * @extends Ember.Route
 * @uses EmberSimpleAuth.ApplicationRouteMixin
 * @public
 */
export default Route.extend(ApplicationRouteMixin, {
  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * After model hook
   *
   * Removes the loading mask
   *
   * @method afterModel
   * @public
   */
  afterModel() {
    $('body').removeClass('loading-mask')
  },

  /**
   * Transition to login after logout
   *
   * @event sessionInvalidated
   * @public
   */
  sessionInvalidated() {
    this.transitionTo('login')
  },

  /**
   * The actions for the application route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Invalidate the session
     *
     * @method invalidateSession
     * @public
     */
    invalidateSession() {
      this.get('session').invalidate()
    }
  }
})
