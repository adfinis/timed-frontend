import Route from 'ember-route'

export default Route.extend({
  model() {
    return this.modelFor('projects.edit')
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()
      }
      catch (e) {
        // TODO: print actual error message
        this.get('notify').error('Error')
      }
    }
  }
})
