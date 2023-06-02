import Transform from "@ember-data/serializer/transform";

/**
 * Django worktime transform
 *
 * This transforms a string like '1,2,3' into an array of numbers
 *
 * @class DjangoWorktimeTransform
 * @extends DS.Transform
 * @public
 */
export default class DjangoWorkdaysTransform extends Transform {
  /**
   * Deserialize the string separated by comma into an array of numbers
   *
   * @method deserialize
   * @param {String} serialized The string
   * @return {Number[]} The deserialized array
   * @public
   */
  deserialize(serialized) {
    return serialized.map(Number);
  }

  /**
   * Serialize the array of numbers into a string separated by comma
   *
   * @method serialize
   * @param {Number[]} deserialized The number array
   * @return {String} The serialized string
   * @public
   */
  serialize(deserialized) {
    return deserialized.map(String);
  }
}
