/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { isUnauthorizedError } from "ember-ajax/errors";
import AjaxService from "ember-ajax/services/ajax";

/**
 * The ajax service
 *
 * @class AjaxService
 * @extends EmberAjax.AjaxService
 * @public
 */
export default class AjaxCustomService extends AjaxService {
  @service session;
  @service router;

  /**
   * The JWT access token.
   *
   * @property {String} token
   * @public
   */
  @reads("session.data.authenticated.access_token") token;

  /**
   * The HTTP request headers
   *
   * This contains the content type and the authorization information
   *
   * @property {Object} headers
   * @public
   */
  get headers() {
    const headers = {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    };

    const auth = this.token ? { Authorization: `Bearer ${this.token}` } : {};

    return Object.assign(headers, auth);
  }

  handleResponse(status, headers, payload, requestData) {
    const response = super.handleResponse(
      status,
      headers,
      payload,
      requestData
    );

    if (isUnauthorizedError(response)) {
      this.router.transitionTo("login");
    }
    return response;
  }
}
