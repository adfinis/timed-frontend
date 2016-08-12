import Route from 'ember-route'

export default Route.extend({
  model() {
    return this.store.createRecord('customer')
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()

        this.transitionTo('customers.index')
      }
      catch(e) {
        console.error(e)
      }
    }
  }
})
