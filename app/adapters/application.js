/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import JSONAPIAdapter from "@ember-data/adapter/json-api";
import OIDCAdapterMixin from "ember-simple-auth-oidc/mixins/oidc-adapter-mixin";

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends OIDCAdapterMixin
 * @uses EmberSimpleAuthOIDC.OIDCAdapterMixin
 * @public
 */
export default JSONAPIAdapter.extend(OIDCAdapterMixin, {
  namespace: "api/v1",
});
