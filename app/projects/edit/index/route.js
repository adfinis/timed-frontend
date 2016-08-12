import Route from 'ember-route'

export default Route.extend({
  beforeModel() {
    return Promise.all([
      this.store.findAll('customer'),
      this.store.findAll('user')
    ])
  },

  model() {
    return this.modelFor('projects.edit')
  },

  setupController(controller, model) {
    this._super(...arguments)

    controller.set('customers', this.store.peekAll('customer'))
    controller.set('users',     this.store.peekAll('user'))
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()

        this.transitionTo('projects.index')
      }
      catch (e) {
        console.error(e)
      }
    },

    async delete() {
      try {
        await this.get('currentModel').destroyRecord()

        this.transitionTo('projects.index')
      }
      catch (e) {
        console.error(e)
      }
    },
  }
})
