import { Model, belongsTo } from 'ember-cli-mirage'

export default Model.extend({
  task: belongsTo(),
  absenceType: belongsTo(),
  activity: belongsTo(),
  user: belongsTo()
})
