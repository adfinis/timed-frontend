/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The customer assignee model
 *
 * @class CustomerAssignee
 * @extends DS.Model
 * @public
 */
export default class CustomerAssignee extends Model {
  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  @belongsTo("customer") customer;
  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  @belongsTo("user") user;

  /**
   * Whether the assignee is a reviewer
   *
   * @property isReviewer
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) isReviewer;

  /**
   * Whether the assignee is a manager
   *
   * @property isManager
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) isManager;

  /**
   * Whether the assignee is a resource
   *
   * @property isResource
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) isResource;
}
