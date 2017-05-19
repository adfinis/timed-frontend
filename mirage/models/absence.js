import { Model, belongsTo } from 'ember-cli-mirage'

export default Model.extend({
  type: belongsTo('absenceType'),
  user: belongsTo()
})
