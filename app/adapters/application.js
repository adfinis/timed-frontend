/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import JSONAPIAdapter from 'ember-data/adapters/json-api'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin'
import { reads } from '@ember/object/computed'
import { isPresent } from '@ember/utils'

/**
 * The application adapter
 *
 * @class ApplicationAdapter
 * @extends DS.JSONAPIAdapter
 * @uses EmberSimpleAuth.DataAdapterMixin
 * @public
 */
export default JSONAPIAdapter.extend(DataAdapterMixin, {
  token: reads('session.data.authenticated.token'),

  /**
   * The API namespace
   *
   * @property {String} namespace
   * @public
   */
  namespace: 'api/v1',

  authorize(xhr) {
    if (isPresent(this.token)) {
      xhr.setRequestHeader('Authorization', `Bearer ${this.token}`)
    }
  }
})
