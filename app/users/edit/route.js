import Route from '@ember/routing/route'

export default Route.extend({
  model({ user_id: id }) {
    return this.store.findRecord('user', id, { include: 'supervisors' })
  }
})
