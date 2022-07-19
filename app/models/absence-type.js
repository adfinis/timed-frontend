/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, hasMany } from "@ember-data/model";

/**
 * The absence type model
 *
 * @class AbsenceType
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The name of the absence type
   *
   * E.g Military, Holiday or Sickness
   *
   * @property {String} name
   * @public
   */
  name: attr("string"),

  /**
   * Whether the absence type only fills the worktime
   *
   * @property {Boolean} fillWorktime
   * @public
   */
  fillWorktime: attr("boolean"),

  /**
   * The balances for this type
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  absenceBalances: hasMany("absence-balance"),
});
