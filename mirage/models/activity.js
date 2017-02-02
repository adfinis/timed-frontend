import { Model, belongsTo, hasMany } from 'ember-cli-mirage'

export default Model.extend({
  user: belongsTo(),
  task: belongsTo(),
  blocks: hasMany('activity-block')
})
