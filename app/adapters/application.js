/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import { inject as service } from "@ember/service";
import OIDCJSONAPIAdapter from "ember-simple-auth-oidc/adapters/oidc-json-api-adapter";

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends OIDCAdapterMixin
 * @uses EmberSimpleAuthOIDC.OIDCAdapterMixin
 * @public
 */
export default class ApplicationAdapter extends OIDCJSONAPIAdapter {
  @service session;
  @service router;

  namespace = "api/v1";

  get headers() {
    return { ...this.session.headers };
  }

  handleResponse(status, ...args) {
    if (status === 401) {
      if (this.session.isAuthenticated) {
        this.session.invalidate();
      } else {
        this.router.transitionTo("login");
      }
    }

    return super.handleResponse(status, ...args);
  }
}
