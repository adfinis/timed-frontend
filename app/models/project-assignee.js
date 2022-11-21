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
export default Model.extend({
  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  project: belongsTo("project"),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo("user"),

  /**
   * Whether the assignee is a reviewer
   *
   * @property isReviewer
   * @type {Boolean}
   * @public
   */
  isReviewer: attr("boolean", { defaultValue: false }),

  /**
   * Whether the assignee is a manager
   *
   * @property isManager
   * @type {Boolean}
   * @public
   */
  isManager: attr("boolean", { defaultValue: false }),

  /**
   * Whether the assignee is a resource
   *
   * @property isResource
   * @type {Boolean}
   * @public
   */
  isResource: attr("boolean", { defaultValue: false }),
});
