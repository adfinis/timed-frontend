import { Factory, faker } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  date: () => moment().format('YYYY-MM-DD'),
  duration: () => randomDuration(),
  comment: () => faker.lorem.sentence()
})
