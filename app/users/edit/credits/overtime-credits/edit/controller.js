import Controller from '@ember/controller'
import { task } from 'ember-concurrency'
import OvertimeCreditValidations from 'timed/validations/overtime-credit'

export default Controller.extend({
  OvertimeCreditValidations,

  credit: task(function*() {
    let id = this.get('model')
    let user = this.get('user')

    return id
      ? yield this.store.findRecord('overtime-credit', id)
      : yield this.store.createRecord('overtime-credit', { user })
  })
})
