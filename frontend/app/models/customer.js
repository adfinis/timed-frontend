/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, hasMany } from "@ember-data/model";

/**
 * The customer model
 *
 * @class Customer
 * @extends DS.Model
 * @public
 */
export default class Customer extends Model {
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  @attr("string", { defaultValue: "" }) name;

  /**
   * Whether the project is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) archived;

  /**
   * The projects
   *
   * @property projects
   * @type {Project[]}
   * @public
   */
  @hasMany("project") projects;

  /**
   * Long name - alias for name, used for filtering in the customer box
   *
   * @property {String} longName
   * @public
   */
  get longName() {
    return this.name;
  }

  /**
   * Assigned users to this customer
   *
   * @property assignees
   * @type {CustomerAssignee[]}
   * @public
   */
  @hasMany("customer-assignee") assignees;
}
