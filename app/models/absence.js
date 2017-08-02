/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'

import { belongsTo } from 'ember-data/relationships'

/**
 * The report model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  comment: attr('string', { defaultValue: '' }),

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: attr('django-duration', { defaultValue: () => moment.duration() }),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr('django-date'),

  /**
   * The type of the absence
   *
   * @property {AbsenceType} type
   * @public
   */
  type: belongsTo('absence-type'),

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo('user')
})
