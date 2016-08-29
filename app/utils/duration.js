import { padStartTpl } from 'ember-pad/utils/pad'

const { floor } = Math
const padTpl2   = padStartTpl(2)

export function formatDuration(duration, seconds = true) {
  if (!duration || duration.milliseconds() < 0) return seconds ? '--:--:--' : '--:--'

  let hours   = floor(duration.asHours())
  let minutes = duration.minutes()

  if (seconds) {
    let seconds = duration.seconds()
    return padTpl2`${hours}:${minutes}:${seconds}`
  }

  return padTpl2`${hours}:${minutes}`
}
