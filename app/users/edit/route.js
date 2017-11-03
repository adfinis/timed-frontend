import Route from '@ember/routing/route'
import { CanMixin } from 'ember-can'

export default Route.extend(CanMixin, {
  model({ user_id: id }) {
    return this.store.findRecord('user', id, { include: 'supervisors' })
  },

  afterModel(model) {
    if (!this.can('read user', model)) {
      this.replaceWith('users')
    }
  }
})
