import Route from 'ember-route'

export default Route.extend({
  model() {
    return this.modelFor('projects.edit')
  },

  setupController(controller) {
    this._super(...arguments)

    controller.set('task', null)
  },

  actions: {
    cancel() {
      this.get('controller.task').rollbackAttributes()
      this.set('controller.task', null)
    },

    async delete() {
      let task = this.get('controller.task')

      if (!task) {
        return
      }

      try {
        await task.destroyRecord()

        this.send('cancel')
      }
      catch(e) {
        // TODO: handle error
      }
    },

    async save() {
      let task = this.get('controller.task')

      if (!task) {
        return
      }

      try {
        await task.save()

        this.send('cancel')
      }
      catch(e) {
        // TODO: handle error
      }
    },

    editTask(task = null) {
      if (!task) {
        task = this.store.createRecord('task', { project: this.get('currentModel') })
      }

      this.set('controller.task', task)
    }
  }
})
