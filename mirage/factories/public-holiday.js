import { Factory, faker } from 'ember-cli-mirage'
import moment                          from 'moment'

export default Factory.extend({
  name: () => faker.lorem.word(),
  // location: association(),

  date() {
    let random = faker.date.between(moment.startOf('year').format('YYYY-MM-DD'), moment.endOf('year').format('YYYY-MM-DD'))

    return moment(random).startOf('day')
  },

  afterCreate(publicHoliday, server) {
    publicHoliday.update({ locationId: server.create('location').id })
  }
})
