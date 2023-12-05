/**
 * @module timed
 * @submodule timed-serializers
 * @public
 */
import ApplicationSerializer from "timed/serializers/application";

/**
 * The attendance serializer
 *
 * @class AttendanceSerializer
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
   * @property {String} from
   * @property {String} to
   * @public
   */
  attrs: {
    from: "from-time",
    to: "to-time",
  },
});
