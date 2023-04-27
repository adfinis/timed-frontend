/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The project assignee model
 *
 * @class ProjectAssignee
 * @extends DS.Model
 * @public
 */
export default class ProjectAssignee extends Model {
  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  @belongsTo("project") project;

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
