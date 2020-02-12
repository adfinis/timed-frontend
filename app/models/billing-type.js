/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import attr from "ember-data/attr";
import Model from "ember-data/model";

/**
 * The billing type model
 *
 * @class BillingType
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The name
   *
   * @property {String} name
   * @public
   */
  name: attr("string")
});
