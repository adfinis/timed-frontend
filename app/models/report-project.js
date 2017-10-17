import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'
import { oneWay } from 'ember-computed-decorators'

export default Model.extend({
  duration: attr('django-duration'),
  project: belongsTo('project'),
  @oneWay('project.estimatedTime') estimated: null,
  @oneWay('project.customer') customer: null
})
