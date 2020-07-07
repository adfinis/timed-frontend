/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import OIDCAuthenticationRouteMixin from "ember-simple-auth-oidc/mixins/oidc-authentication-route-mixin";

/**
 * The login route
 *
 * @class LoginRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(OIDCAuthenticationRouteMixin, {});
