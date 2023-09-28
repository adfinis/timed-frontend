/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The task assignee model
 *
 * @class TaskAssignee
 * @extends DS.Model
 * @public
 */
export default class TaskAssignee extends Model {
  /**
   * The task
   *
   * @property task
   * @type {Task}
   * @public
   */
  @belongsTo("task") task;
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
