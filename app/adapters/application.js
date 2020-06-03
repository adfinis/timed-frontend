/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import DS from "ember-data";
import OIDCAdapterMixin from "ember-simple-auth-oidc/mixins/oidc-adapter-mixin";

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends OIDCAdapterMixin
 * @uses EmberSimpleAuthOIDC.OIDCAdapterMixin
 * @public
 */
export default DS.JSONAPIAdapter.extend(OIDCAdapterMixin, {
  namespace: "api/v1"
});
