/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import attr from "ember-data/attr";
import Model from "ember-data/model";
import { belongsTo } from "ember-data/relationships";

/**
 * The task assignee model
 *
 * @class TaskAssignee
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The user
   *
   * @property user
   * @type {Task}
   * @public
   */
  task: belongsTo("task"),
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
  isResource: attr("boolean", { defaultValue: false })
});
