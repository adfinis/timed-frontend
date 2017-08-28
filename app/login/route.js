/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin'

/**
 * The login route
 *
 * @class LoginRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(UnauthenticatedRouteMixin, {})
