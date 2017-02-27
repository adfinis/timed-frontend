import { Factory, faker, trait } from 'ember-cli-mirage'
import { padStartTpl }           from 'ember-pad/utils/pad'

const HOURS_PER_DAY = 8.5

export default Factory.extend({
  percentage: faker.list.random(50, 60, 80, 100),
  // location: association(),
  // user: association(),

  worktimePerDay() {
    let minutesFullTime = HOURS_PER_DAY * 60

    let minutesWorktime = minutesFullTime / 100 * this.percentage

    let hours = Math.floor(minutesWorktime / 60)
    let minutes = Math.round(minutesWorktime % 60)

    return padStartTpl(2)`${hours}:${minutes}:00`
  },

  start: () => faker.date.past(4),
  end: () => faker.date.past(1),

  active: trait({
    start: () => faker.date.recent(),
    end: null
  }),

  afterCreate(employment, server) {
    employment.update({ locationId: server.create('location').id })
  }
})
