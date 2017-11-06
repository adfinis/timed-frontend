import { Ability } from 'ember-can'
import { oneWay } from 'ember-computed-decorators'

export default Ability.extend({
  @oneWay('user.isSuperuser') canEdit: false,
  @oneWay('user.isSuperuser') canCreate: false
})
