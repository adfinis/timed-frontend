/**
 * @module timed
 * @submodule timed-serializers
 * @public
 */
import ApplicationSerializer from 'timed/serializers/application'

/**
 * The activity block serializer
 *
 * @class ActivityBlockSerializer
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
   * @property {String} attrs.from
   * @property {String} attrs.to
   * @public
   */
  attrs: {
    from: 'from-datetime',
    to: 'to-datetime'
  }
})
