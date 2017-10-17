import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'
import { oneWay } from 'ember-computed-decorators'

export default Model.extend({
  duration: attr('django-duration'),
  task: belongsTo('task'),

  @oneWay('task.estimatedTime') estimated: null,
  @oneWay('task.project') project: null,
  @oneWay('task.project.customer') customer: null
})
