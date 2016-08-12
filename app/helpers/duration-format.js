import Helper          from 'ember-helper'
import { padStartTpl } from 'ember-pad/utils/pad'

const { floor } = Math
const padTpl2   = padStartTpl(2)

export default Helper.extend({
  compute([ duration ]) {
    if (!duration || duration.milliseconds() < 0) return '--:--:--'

    let hours   = floor(duration.asHours())
    let minutes = duration.minutes()
    let seconds = duration.seconds()

    return padTpl2`${hours}:${minutes}:${seconds}`
  }
})
