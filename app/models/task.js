/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'
import computed      from 'ember-computed-decorators'

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
  name: attr('string', { defaultValue: '' }),

  /**
   * The estimated time
   *
   * @property estimatedTime
   * @type {Number}
   * @public
   */
  estimatedTime: attr('number'),

  /**
   * Whether the task is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr('boolean', { defaultValue: false }),

  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  project: belongsTo('project'),

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

  @computed('project')
  longName(project) {
    let taskName = this.get('name')
    let projectName = project.get('name')
    let customerName = project.get('customer.name')

    return `${customerName} > ${projectName} > ${taskName}`
  }
})
