import { Ability } from 'ember-can'
import { oneWay } from '@ember/object/computed'

const OvertimeCreditAbility = Ability.extend({
  canEdit: oneWay('user.isSuperuser'),
  canCreate: oneWay('user.isSuperuser')
})

export default OvertimeCreditAbility
