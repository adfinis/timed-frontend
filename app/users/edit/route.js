import Route from '@ember/routing/route'
import { CanMixin } from 'ember-can'

export default Route.extend(CanMixin, {
  model({ id }) {
    return this.store.findRecord('user', id, {
      include: 'supervisors,supervisees'
    })
  },

  afterModel(model) {
    if (!this.can('read user', model)) {
      this.replaceWith('users')
    }
  }
})
