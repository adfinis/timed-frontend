import Route   from 'ember-route'
import RSVP    from 'rsvp'
import service from 'ember-service/inject'

export default Route.extend({
  notify: service('notify'),

  beforeModel() {
    return RSVP.Promise.all([
      this.store.findAll('user'),
      this.store.findAll('customer')
    ])
  },

  model() {
    return this.store.createRecord('project')
  },

  setupController(controller) {
    this._super(...arguments)

    controller.set('users',     this.store.peekAll('user'))
    controller.set('customers', this.store.peekAll('customer'))
  },

  deactivate() {
    this.get('currentModel').rollbackAttributes()
  },

  actions: {
    async save() {
      try {
        let model = this.get('currentModel')

        await model.save()

        this.get('notify').success(`Created new project '${model.get('name')}'`)

        this.transitionTo('projects.edit', model)
      }
      catch(e) {
        // TODO: print actual error message
        this.get('notify').error('Error')
      }
    }
  }
})
