import Transform from "@ember-data/serializer/transform";
import moment from "moment";

/**
 * The moment transform
 *
 * This transforms any string into a moment object
 *
 * @class MomentTransform
 * @extends DS.Transform
 * @public
 */
export default class MomentTransform extends Transform {
  /**
   * The default date string format
   *
   * @property {String} format
   * @public
   */
  format = moment.defaultFormat;

  /**
   * Deserialize the string into a moment object
   *
   * @method deserialize
   * @param {String} serialized The date string
   * @return {moment.duration} The deserialized moment object
   * @public
   */
  deserialize(serialized) {
    return serialized ? moment(serialized, this.format) : null;
  }

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
      ? deserialized.format(this.format)
      : null;
  }
}
