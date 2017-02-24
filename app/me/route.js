/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import service from 'ember-service/inject'

/**
 * The me route
 *
 * @class MeRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  session: service('session'),
  /**
   * Model hook, fetch all employments related to the current user
   *
   * @method model
   * @return {RSVP.Promise} A promise which resolves into if all data is fetched
   * @public
   */
  model() {
    let id = this.get('session.data.authenticated.user_id')

    return this.store.findRecord('user', id, { include: 'employments,employments.location' })
  }
})
