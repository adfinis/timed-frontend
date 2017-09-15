/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import { inject as service } from '@ember/service'
import { task } from 'ember-concurrency'

/**
 * Login controller
 *
 * @class LoginController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
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
   * Authenticate the user
   *
   * @method authenticate
   * @param {String} username The username
   * @param {String} password The password
   * @public
   */
  authenticate: task(function*(username, password) {
    try {
      yield this.get('session').authenticate('authenticator:application', {
        username,
        password
      })

      this.store.unloadAll()
    } catch (e) {
      this.get('notify').error('Wrong username or password')
    }
  }).drop()
})
