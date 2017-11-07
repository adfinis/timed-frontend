import Controller, { inject as controller } from '@ember/controller'
import { inject as service } from '@ember/service'
import { task } from 'ember-concurrency'
import OvertimeCreditValidations from 'timed/validations/overtime-credit'

export default Controller.extend({
  OvertimeCreditValidations,

  userController: controller('users.edit'),

  notify: service('notify'),

  credit: task(function*() {
    let id = this.get('model')

    return id
      ? yield this.store.findRecord('overtime-credit', id)
      : yield this.store.createRecord('overtime-credit', {
          user: this.get('user')
        })
  }),

  save: task(function*(changeset) {
    yield changeset.validate()

    /* istanbul ignore next */
    if (changeset.get('isInvalid')) {
      return
    }

    try {
      yield changeset.save()

      this.get('notify').success('Overtime credit was saved')

      this.get('userController.data').perform(this.get('user.id'))

      this.transitionToRoute('users.edit.credits')
    } catch (e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while saving the overtime credit')
    }
  }).drop(),

  delete: task(function*(credit) {
    try {
      yield credit.destroyRecord()

      this.get('notify').success('Overtime credit was deleted')

      this.get('userController.data').perform(this.get('user.id'))

      this.transitionToRoute('users.edit.credits')
    } catch (e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while deleting the overtime credit')
    }
  }).drop()
})
