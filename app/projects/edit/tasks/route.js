import Route from 'ember-route'

export default Route.extend({
  model() {
    return this.modelFor('projects.edit')
  },

  setupController(controller) {
    this._super(...arguments)

    controller.set('task', null)
  }
})
