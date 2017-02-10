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
   * Before model hook, fetch all customers and the current activity
   *
   * @method beforeModel
   * @return {RSVP.Promise} A promise which resolves once all data is fetched
   * @public
   */
  beforeModel() {
    this._super(...arguments)

    return RSVP.Promise.all([
      this.store.findAll('customer', { include: 'projects,projects.tasks' }),
      this.store.query('activity', { include: 'blocks', active: true })
    ])
  }
})
