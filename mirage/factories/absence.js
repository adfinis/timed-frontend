import { Factory, faker } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment().format('YYYY-MM-DD'),
  duration: () => '08:30:00',

  afterCreate(absence, server) {
    absence.update({ typeId: server.schema.absenceTypes.all().models[0].id })
  }
})
