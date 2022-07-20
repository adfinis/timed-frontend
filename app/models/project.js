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
export default Model.extend({
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  name: attr("string", { defaultValue: "" }),

  /**
   * Whether the project is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr("boolean", { defaultValue: false }),

  /**
   * The estimated time for this project
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  estimatedTime: attr("django-duration"),

  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  customer: belongsTo("customer"),

  /**
   * Whether the project's comments are visible to the customer
   *
   * @property customerVisible
   * @type {Boolean}
   * @public
   */
  customerVisible: attr("boolean", { defaultValue: false }),

  /**
   * The billing
   *
   * @property {BillingType} billingType
   * @public
   */
  billingType: belongsTo("billing-type"),

  /**
   * The tasks
   *
   * @property tasks
   * @type {Task[]}
   * @public
   */
  tasks: hasMany("task"),

  /**
   * Assigned users to this project
   *
   * @property assignees
   * @type {ProjectAssignee[]}
   * @public
   */
  assignees: hasMany("project-assignee"),
});
