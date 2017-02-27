/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import ApplicationAdapter from 'timed/adapters/application'

/**
 * The activity block adapter
 *
 * @class ActivityBlockAdapter
 * @extends ApplicationAdapter
 * @public
 */
export default ApplicationAdapter.extend({
  /**
   * Custom url for updating records
   *
   * This causes a reload of the activity so we don't have to do the reload
   * ourselves
   *
   * @method urlForUpdateRecord
   * @return {String} The URL
   * @public
   */
  urlForUpdateRecord() {
    return `${this._super(...arguments)}?include=activity`
  }
})
