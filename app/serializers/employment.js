/**
 * @module timed
 * @submodule timed-serializers
 * @public
 */
import ApplicationSerializer from "timed/serializers/application";

/**
 * The employment block serializer
 *
 * @class EmploymentBlockSerializer
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
   * @property {String} start
   * @property {String} end
   * @public
   */
  attrs: {
    start: "start-date",
    end: "end-date",
  },
});
