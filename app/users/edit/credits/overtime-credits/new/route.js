import Route from '@ember/routing/route'

const EDIT_PATH = 'users.edit.credits.overtime-credits.edit'

export default Route.extend({
  controllerName: EDIT_PATH,

  templateName: EDIT_PATH,

  model: () => null,

  setupController(controller) {
    this._super(...arguments)

    controller.set('user', this.modelFor('users.edit'))
    controller.get('credit').perform()
  }
})
