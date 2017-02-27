/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route                   from 'ember-route'
import RSVP                    from 'rsvp'
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
   * Model hook, fetch all customers and the current activity
   *
   * @method model
   * @return {RSVP.Promise} A promise which resolves once all data is fetched
   * @public
   */
  model() {
    return RSVP.Promise.all([
      this.store.findAll('customer', { include: 'projects,projects.tasks' }),
      this.store.query('activity', { include: 'blocks', active: true })
    ])
  }
})
