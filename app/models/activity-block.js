/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model  from 'ember-data/model'
import attr   from 'ember-data/attr'
import moment from 'moment'

import {
  belongsTo
} from 'ember-data/relationships'

/**
 * The activity block model
 *
 * @class ActivityBlock
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The start date and time
   *
   * @property from
   * @type {moment}
   * @public
   */
  from: attr('django-datetime', { defaultValue: () => moment() }),

  /**
   * The end date and time
   *
   * @property to
   * @type {moment}
   * @public
   */
  to: attr('django-datetime'),

  /**
   * The activity
   *
   * @property activity
   * @type {Activity}
   * @public
   */
  activity: belongsTo('activity')
})
