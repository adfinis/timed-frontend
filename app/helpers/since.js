import DurationFormatHelper from 'timed/helpers/duration-format'
import { later }            from 'ember-runloop'

export default DurationFormatHelper.extend({
  compute([ startTime, elapsed = moment.duration() ]) {
    later(() => {
      this.recompute()
    }, 1000)

    let runtime = moment.duration(moment().diff(startTime)).add(elapsed)

    return this._super([ runtime ])
  }
})
