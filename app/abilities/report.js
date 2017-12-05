import { Ability } from 'ember-can'
import computed from 'ember-computed-decorators'

export default Ability.extend({
  @computed(
    'user.{id,isSuperuser}',
    'model.{user.id,user.supervisors,task.project.reviewers}'
  )
  canEdit(
    currentUserId = null,
    isSuperuser = false,
    userId = null,
    supervisors = [],
    reviewers = []
  ) {
    return (
      isSuperuser ||
      userId === currentUserId ||
      supervisors.mapBy('id').includes(currentUserId) ||
      reviewers.mapBy('id').includes(currentUserId)
    )
  }
})
