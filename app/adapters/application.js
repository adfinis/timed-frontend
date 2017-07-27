/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import JSONAPIAdapter from 'ember-data/adapters/json-api'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin'

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends DS.JSONAPIAdapter
 * @uses EmberSimpleAuth.DataAdapterMixin
 * @public
 */
export default JSONAPIAdapter.extend(DataAdapterMixin, {
  /**
   * The authorizer
   *
   * @property {String} authorizer
   * @public
   */
  authorizer: 'authorizer:application',

  /**
   * The API namespace
   *
   * @property {String} namespace
   * @public
   */
  namespace: 'api/v1'
})
