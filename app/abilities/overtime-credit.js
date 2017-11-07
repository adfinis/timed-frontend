import { Ability } from 'ember-can'
import { oneWay } from 'ember-computed-decorators'

const OvertimeCreditAbility = Ability.extend({
  @oneWay('user.isSuperuser') canEdit: false,
  @oneWay('user.isSuperuser') canCreate: false
})

export default OvertimeCreditAbility
