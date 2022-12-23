/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import { get } from "@ember/object";

/**
 * The task model
 *
 * @class Task
 * @extends Model
 * @public
 */
export default class Task extends Model {
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  @attr("string", { defaultValue: "" }) name;

  /**
   * The estimated time
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  @attr("django-duration") estimatedTime;

  /**
   * Whether the task is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false }) archived;

  @attr("string", { defaultValue: "" }) reference;

  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  @belongsTo("project") project;

  /**
   * Assigned users to this task
   *
   * @property assignees
   * @type {TaskAssignee[]}
   * @public
   */
  @hasMany("task-assignee") assignees;

  /**
   * Flag saying that this is a task.
   * Used in /app/customer-suggestion/template.hbs
   * We're using this as a workaround for the fact that one
   * can't seem to use helpers like "(eq" in inline templates
   *
   * @property project
   * @type {Project}
   * @public
   */
  isTask = true;

  get longName() {
    const taskName = this.name;
    const projectName = get(this, "project.name");
    const customerName = get(this, "project.customer.name");

    return `${customerName} > ${projectName} > ${taskName}`;
  }
}
