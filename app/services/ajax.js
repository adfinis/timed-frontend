/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import { computed } from "@ember/object";
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
   * The HTTP request headers
   *
   * This contains the content type and the authorization information
   *
   * @property {Object} headers
   * @public
   */
  headers: computed("session.data.authenticated.token", function() {
    const headers = {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    };

    const auth = this.get("session.data.authenticated.token")
      ? {
          Authorization: `Bearer ${this.get(
            "session.data.authenticated.token"
          )}`
        }
      : {};

    return Object.assign(headers, auth);
  })
});
