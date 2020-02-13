/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import JSONAPIAdapter from "ember-data/adapters/json-api";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends DS.JSONAPIAdapter
 * @uses EmberSimpleAuth.DataAdapterMixin
 * @public
 */
export default JSONAPIAdapter.extend(DataAdapterMixin, {
  token: reads("session.data.authenticated.token"),

  /**
   * The API namespace
   *
   * @property {String} namespace
   * @public
   */
  namespace: "api/v1",

  headers: computed("token", function() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  })
});
