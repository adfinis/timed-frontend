import Route from '@ember/routing/route'

export default Route.extend({
  model: ({ absence_credit_id: id }) => id,

  setupController(controller) {
    this._super(...arguments)

    controller.set('user', this.modelFor('users.edit'))
    controller.get('absenceTypes').perform()
    controller.get('credit').perform()
  }
})
