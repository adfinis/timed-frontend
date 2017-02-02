import Helper         from 'ember-helper'
import formatDuration from 'timed/utils/format-duration'

export default Helper.extend({
  compute([ duration ]) {
    return formatDuration(duration)
  }
})
