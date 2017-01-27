/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

import {
  belongsTo
} from 'ember-data/relationships'

/**
 * Report model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  comment: attr('string', { defaultValue: '' }),
  duration: attr('django-duration'),
  review: attr('boolean', { defaultValue: false }),
  nta: attr('boolean', { defaultValue: false }),
  task: belongsTo('task'),
  user: belongsTo('user')
})
