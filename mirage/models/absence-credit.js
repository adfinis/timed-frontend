import { Model, belongsTo } from 'ember-cli-mirage'

export default Model.extend({
  user: belongsTo(),
  absenceType: belongsTo('user-absence-type')
})
