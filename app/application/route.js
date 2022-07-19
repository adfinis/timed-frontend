/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import OIDCApplicationRouteMixin from "ember-simple-auth-oidc/mixins/oidc-application-route-mixin";

/**
 * The application route
 *
 * @class ApplicationRoute
 * @extends Ember.Route
 * @uses EmberSimpleAuth.ApplicationRouteMixin
 * @public
 */
export default Route.extend(OIDCApplicationRouteMixin, {
  autostartTour: service(),

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
      this.set("autostartTour.done", []);

      this.session.invalidate();
    },
  },
});
