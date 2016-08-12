import Component from 'ember-component'
import { bool }  from 'ember-computed-decorators'
import service   from 'ember-service/inject'

export default Component.extend({
  store: service('store'),

  classNames: [ 'grid', 'grid--12of12' ],

  @bool('task')
  editing: false,

  task: null,

  _rollbackTask() {
    if (this.get('task')) {
      this.get('task').rollbackAttributes()
    }
  },

  actions: {
    cancel() {
      this._rollbackTask()
      this.set('task', null)
    },

    editTask(task) {
      if (task === this.get('task')) {
        return
      }

      this._rollbackTask()
      this.set('task', task)
    },

    createTask() {
      this._rollbackTask()
      this.set('task', this.get('store').createRecord('task', { project: this.get('project') }))
    }
  }
})
