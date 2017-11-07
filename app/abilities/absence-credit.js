import { Ability } from 'ember-can'
import { oneWay } from 'ember-computed-decorators'

const AbsenceCreditAbility = Ability.extend({
  @oneWay('user.isSuperuser') canEdit: false,
  @oneWay('user.isSuperuser') canCreate: false
})

export default AbsenceCreditAbility
