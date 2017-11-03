import Route from '@ember/routing/route'

export default Route.extend({
  model: ({ overtime_credit_id: id }) => id,

  setupController(controller) {
    this._super(...arguments)

    controller.set('user', this.modelFor('users.edit'))
    controller.get('credit').perform()
  }
})
