import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

import {
  belongsTo,
  hasMany
} from 'ember-data/relationships'

export default Model.extend({
  comment:  attr('string', { defaultValue: '' }),
  duration: attr('django-duration'),
  review:   attr('boolean', { defaultValue: false }),
  nta:      attr('boolean', { defaultValue: false }),
  task:     belongsTo('task'),
  user:     belongsTo('user')
})
