import { Factory } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  duration: () => randomDuration(15, false, 20),

  afterCreate(customerStatistic, server) {
    customerStatistic.update({ customerId: server.create('customer').id })
  }
})
