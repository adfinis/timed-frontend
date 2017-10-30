import { Ability } from 'ember-can'
import computed from 'ember-computed-decorators'

export default Ability.extend({
  @computed('user.{id,isSuperuser}', 'model.{id,supervisors}')
  canRead(id, isSuperuser, modelId, modelSupervisors) {
    return (
      isSuperuser || id === modelId || modelSupervisors.mapBy('id').includes(id)
    )
  }
})
