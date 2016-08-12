import Route   from 'ember-route'
import service from 'ember-service/inject'

export default Route.extend({
  notify: service('notify'),

  model({ id }) {
    return this.store.findRecord('task-template', id)
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        await this.get('currentModel').save()

        this.get('notify').success('Task template saved')

        this.transitionTo('task-template.index')
      }
      catch(e) {
        console.error(e)
      }
    },

    async delete() {
      try {
        await this.get('currentModel').destroyRecord()

        this.get('notify').info('Task template deleted')

        this.transitionTo('task-template.index')
      }
      catch(e) {
        console.error(e)
      }
    }
  }
})
