import Route from 'ember-route'

export default Route.extend({
  model() {
    return this.store.createRecord('task-template')
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()

        this.transitionTo('task-templates.index')
      }
      catch(e) {
        // TODO: print actual error message
        this.get('notify').error('Error')
      }
    }
  }
})
