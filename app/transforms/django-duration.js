import Transform from 'ember-data/transform'
import moment    from 'moment'

import {
  padTpl
} from 'ember-pad/utils/pad'

const padTpl2 = padTpl(2)

export default Transform.extend({
  deserialize(serialized) {
    if (!serialized) {
      return null
    }

    let [ hours, minutes, seconds ] = serialized.split(':').map(Number)

    return moment.duration({ hours, minutes, seconds })
  },

  serialize(deserialized) {
    if (!moment.isDuration(deserialized)) {
      return null
    }

    let hours   = Math.floor(deserialized.asHours())
    let minutes = deserialized.minutes()
    let seconds = deserialized.seconds()

    return padTpl2`${hours}:${minutes}:${seconds}`
  }
})
