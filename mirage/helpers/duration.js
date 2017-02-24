import { faker }       from 'ember-cli-mirage'
import { padStartTpl } from 'ember-pad/utils/pad'

export function randomDuration(precision = 15, seconds = false) {
  let h = faker.random.number({ max: 2 })
  let m = Math.ceil(faker.random.number({ min: 0, max: 60 }) / precision) * precision
  let s = seconds ? faker.random.number({ max: 59, min: 0 }) : 0

  return padStartTpl(2)`${h}:${m}:${s}`
}
