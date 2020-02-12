import { Ability } from 'ember-can'
import { reads } from '@ember/object/computed'

const AbsenceCreditAbility = Ability.extend({
  canEdit: reads('user.isSuperuser'),
  canCreate: reads('user.isSuperuser')
})

export default AbsenceCreditAbility
