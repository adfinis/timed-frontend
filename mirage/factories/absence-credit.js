import { Factory }        from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  duration: () => randomDuration(),
  used: () => randomDuration(),
  balance: () => randomDuration(),

  afterCreate(absenceCredit, server) {
    absenceCredit.update({ absenceTypeId: server.create('absence-type').id })
  }
})
