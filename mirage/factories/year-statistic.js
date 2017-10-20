import { Factory } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  year: i => 2010 + i,
  duration: () => randomDuration(15, false, 20)
})
