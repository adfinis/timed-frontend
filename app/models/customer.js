/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model       from 'ember-data/model'
import attr        from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'

/**
 * Customer model
 *
 * @class Customer
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  name: attr('string', { defaultValue: '' }),
  email: attr('string', { defaultValue: '' }),
  website: attr('string', { defaultValue: '' }),
  comment: attr('string', { defaultValue: '' }),
  projects: hasMany('project')
})
