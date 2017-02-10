/**
 * @module timed
 * @submodule timed-serializers
 * @public
 */
import ApplicationSerializer from 'timed/serializers/application'

/**
 * The activity serializer
 *
 * @class ActivitySerializer
 * @extends ApplicationSerializer
 * @public
 */
export default ApplicationSerializer.extend({
  /**
   * The attribute mapping
   *
   * This mapps some properties of the response to another
   * property name of the model
   *
   * @property {Object} attrs
   * @property {String} attrs.start
   * @public
   */
  attrs: {
    start: 'start-datetime'
  }
})
