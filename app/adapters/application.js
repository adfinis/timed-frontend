/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
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
  namespace = "api/v1";
}
