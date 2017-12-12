import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

export default Model.extend({
  comment: attr('string'),
  notBillable: attr('boolean', { allowNull: true, defaultValue: null }),
  review: attr('boolean', { allowNull: true, defaultValue: null }),
  verified: attr('boolean', { allowNull: true, defaultValue: null }),

  customer: belongsTo('customer'),
  project: belongsTo('project'),
  task: belongsTo('task')
})
