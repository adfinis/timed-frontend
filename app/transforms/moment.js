/**
 * @module timed
 * @submodule timed-transforms
 * @public
 */
import DS from 'ember-data'
import moment from 'moment'

const { Transform } = DS

/**
 * The moment transform
 *
 * This transforms any string into a moment object
 *
 * @class MomentTransform
 * @extends DS.Transform
 * @public
 */
export default Transform.extend({
  /**
   * The default date string format
   *
   * @property {String} format
   * @public
   */
  format: moment.defaultFormat,

  /**
   * Deserialize the string into a moment object
   *
   * @method deserialize
   * @param {String} serialized The date string
   * @return {moment.duration} The deserialized moment object
   * @public
   */
  deserialize(serialized) {
    return serialized ? moment(serialized, this.get('format')) : null
  },

  /**
   * Serialize the moment object into a string
   *
   * @method serialize
   * @param {String} deserialized The moment object
   * @return {moment.duration} The serialized date string
   * @public
   */
  serialize(deserialized) {
    return deserialized && deserialized.isValid()
      ? deserialized.format(this.get('format'))
      : null
  }
})
