import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class Task extends Model {
  @attr("string", { defaultValue: "" }) name;
  @attr("django-duration") estimatedTime;
  @attr("django-duration") mostRecentRemainingEffort;
  @attr("boolean", { defaultValue: false }) archived;
  @attr("string", { defaultValue: "" }) reference;

  @belongsTo("project") project;
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
    const projectName = this.project.get("name");
    const customerName = this.project.get("customer.name");

    return `${customerName} > ${projectName} > ${taskName}`;
  }
}
