import Route   from 'ember-route'
import service from 'ember-service/inject'

export default Route.extend({
  notify: service('notify'),

  model({ id }) {
    return this.store.findRecord('customer', id)
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()

        this.get('notify').success('Customer saved')

        this.transitionTo('customers.index')
      }
      catch(e) {
        // TODO: print actual error message
        this.get('notify').error('Error')
      }
    },

    async delete() {
      try {
        await this.get('currentModel').destroyRecord()

        this.get('notify').info('Customer deleted')

        this.transitionTo('customers.index')
      }
      catch(e) {
        // TODO: print actual error message
        this.get('notify').error('Error')
      }
    }
  }
})
