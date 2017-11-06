import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

export default Model.extend({
  date: attr('django-date'),
  duration: attr('django-duration'),
  comment: attr('string'),
  user: belongsTo('user')
})
