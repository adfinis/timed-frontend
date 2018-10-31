import { Ability } from 'ember-can'
import { oneWay } from '@ember/object/computed'

const AbsenceCreditAbility = Ability.extend({
  canEdit: oneWay('user.isSuperuser'),
  canCreate: oneWay('user.isSuperuser')
})

export default AbsenceCreditAbility
