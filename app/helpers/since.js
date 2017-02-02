import FormatDurationHelper from 'timed/helpers/format-duration'
import { later }            from 'ember-runloop'
import moment               from 'moment'

export default FormatDurationHelper.extend({
  compute([ startTime, elapsed = moment.duration() ]) {
    later(() => {
      this.recompute()
    }, 1000)

    let runtime = moment.duration(moment().diff(startTime)).add(elapsed)

    return this._super([ runtime ])
  }
})
