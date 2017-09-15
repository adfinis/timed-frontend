/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import $ from 'jquery'
import Ember from 'ember'
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin'

const { testing } = Ember

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

  autostartTour: service('autostart-tour'),

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
    this.transitionTo('login').then(() => {
      if (!testing) {
        /* istanbul ignore next */
        location.reload()
      }
    })
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
      this.set('autostartTour.done', [])

      this.get('session').invalidate()
    }
  }
})
