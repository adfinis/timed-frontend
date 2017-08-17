import { Model, belongsTo } from 'ember-cli-mirage'

export default Model.extend({
  task: belongsTo(),
  activity: belongsTo(),
  user: belongsTo(),
  verifiedBy: belongsTo('user')
})
