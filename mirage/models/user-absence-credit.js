import { Model } from 'ember-cli-mirage'
import { belongsTo, hasMany } from 'ember-cli-mirage'

export default Model.extend({
  user: belongsTo(),
  absenceCredits: hasMany()
})
