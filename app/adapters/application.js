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

  namespace = "api/v1";

  get headers() {
    return { ...this.session.headers };
  }
}
