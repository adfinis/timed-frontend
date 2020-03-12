/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import { computed } from "@ember/object";
import attr from "ember-data/attr";
import Model from "ember-data/model";
import { belongsTo } from "ember-data/relationships";

/**
 * The task model
 *
 * @class Task
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
   * The estimated time
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  estimatedTime: attr("django-duration"),

  /**
   * Whether the task is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr("boolean", { defaultValue: false }),

  reference: attr("string", { defaultValue: "" }),

  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  project: belongsTo("project"),

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
  isTask: true,

  longName: computed("project", function() {
    const taskName = this.get("name");
    const projectName = this.get("project.name");
    const customerName = this.get("project.customer.name");

    return `${customerName} > ${projectName} > ${taskName}`;
  })
});
