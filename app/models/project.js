/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

import {
  belongsTo,
  hasMany
} from 'ember-data/relationships'

/**
 * Project model
 *
 * @class Project
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  name: attr('string', { defaultValue: '' }),
  from: attr('django-date'),
  to: attr('django-date'),
  archived: attr('boolean', { defaultValue: false }),
  trackerType: attr('string', { defaultValue: '' }),
  trackerName: attr('string', { defaultValue: '' }),
  trackerApiKey: attr('string', { defaultValue: '' }),
  customer: belongsTo('customer'),
  leaders: hasMany('user'),
  tasks: hasMany('task')
})
