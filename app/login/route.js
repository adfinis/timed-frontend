/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import service from 'ember-service/inject'

/**
 * The login route
 *
 * @class LoginRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * The actions for the login route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Authenticate the user
     *
     * @method authenticate
     * @param {String} username The username
     * @param {String} password The password
     * @public
     */
    async authenticate(username, password) {
      this.set('controller.loading', true)

      try {
        await this.get('session').authenticate('authenticator:application', { username, password })

        this.store.unloadAll()
      }
      catch(e) {
        this.get('notify').error('Wrong username or password')
      }
      finally {
        this.set('controller.loading', false)
      }
    }
  }
})
