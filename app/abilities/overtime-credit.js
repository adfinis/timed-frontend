import { Ability } from 'ember-can'
import { reads } from '@ember/object/computed'

const OvertimeCreditAbility = Ability.extend({
  canEdit: reads('user.isSuperuser'),
  canCreate: reads('user.isSuperuser')
})

export default OvertimeCreditAbility
