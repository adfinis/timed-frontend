/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import AjaxService from "ember-ajax/services/ajax";

/**
 * The ajax service
 *
 * @class AjaxService
 * @extends EmberAjax.AjaxService
 * @public
 */
export default AjaxService.extend({
  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service("session"),

  /**
   * The JWT access token.
   *
   * @property {String} token
   * @public
   */
  token: reads("session.data.authenticated.access_token"),

  /**
   * The HTTP request headers
   *
   * This contains the content type and the authorization information
   *
   * @property {Object} headers
   * @public
   */
  headers: computed("token", function() {
    const headers = {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    };

    const auth = this.get("token")
      ? { Authorization: `Bearer ${this.get("token")}` }
      : {};

    return Object.assign(headers, auth);
  })
});
