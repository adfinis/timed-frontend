/**
 * @module timed
 * @submodule timed-routes
 * @public
 */

import Route   from 'ember-route'
import service from 'ember-service/inject'

/**
 * Login route
 *
 * @class LoginRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  session: service('session'),

  notify: service('notify'),

  actions: {
    async authenticate(username, password) {
      this.set('controller.loading', true)

      try {
        await this.get('session').authenticate('authenticator:application', { username, password })
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
