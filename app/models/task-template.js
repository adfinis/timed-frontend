/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

/**
 * Task template model
 *
 * @class TaskTemplate
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  name: attr('string', { defaultValue: '' })
})
