/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

/**
 * The project model
 *
 * @class Project
 * @extends DS.Model
 * @public
 */
export default class Project extends Model {
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
   * The estimated time for this project
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  @attr("django-duration") estimatedTime;

  /**
   * Boolean indicating if the remainig effort should be trackable
   * for this project.
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) remainingEffortTracking;

  /**
   * Total remainig effort for this project
   * @property {moment.duration} estimatedtime
   * @public
   */
  @attr("django-duration") totalRemainingEffort;

  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  @belongsTo("customer") customer;

  /**
   * Whether the project's comments are visible to the customer
   *
   * @property customerVisible
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) customerVisible;

  /**
   * The billing
   *
   * @property {BillingType} billingType
   * @public
   */
  @belongsTo("billing-type") billingType;

  /**
   * The tasks
   *
   * @property tasks
   * @type {Task[]}
   * @public
   */
  @hasMany("task") tasks;

  /**
   * Assigned users to this project
   *
   * @property assignees
   * @type {ProjectAssignee[]}
   * @public
   */
  @hasMany("project-assignee") assignees;
}
