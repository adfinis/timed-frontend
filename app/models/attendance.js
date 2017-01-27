/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * Attendance model
 *
 * @class Attendance
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  from: attr('django-datetime'),
  to: attr('django-datetime'),
  user: belongsTo('user')
})
