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
export default class AbsenceType extends Model {
  /**
   * The name of the absence type
   *
   * E.g Military, Holiday or Sickness
   *
   * @property {String} name
   * @public
   */
  @attr("string") name;

  /**
   * Whether the absence type only fills the worktime
   *
   * @property {Boolean} fillWorktime
   * @public
   */
  @attr("boolean") fillWorktime;

  /**
   * The balances for this type
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  @hasMany("absence-balance") absenceBalances;
}
