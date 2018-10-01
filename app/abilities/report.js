import { Ability } from 'ember-can'
import { computed } from '@ember/object'

export default Ability.extend({
  canEdit: computed(
    'user.{id,isSuperuser}',
    'model.{user.id,user.supervisors,task.project.reviewers,verifiedBy}',
    function() {
      return (
        this.get('user.isSuperuser') ||
        (!(this.get('model.verifiedBy') && this.get('model.verifiedBy.id')) &&
          (this.get('model.user.id') === this.get('user.id') ||
            this.getWithDefault('model.user.supervisors', [])
              .mapBy('id')
              .includes(this.get('user.id')) ||
            this.getWithDefault('model.task.project.reviewers', [])
              .mapBy('id')
              .includes(this.get('user.id'))))
      )
    }
  )
})
