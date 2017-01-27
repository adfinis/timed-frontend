/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * Task model
 *
 * @class Task
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  name: attr('string', { defaultValue: '' }),
  estimatedTime: attr('number'),
  archived: attr('boolean', { defaultValue: false }),
  project: belongsTo('project')
})
