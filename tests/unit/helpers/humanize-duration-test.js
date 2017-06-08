import { describe, it }       from 'mocha'
import { expect }             from 'chai'
import { humanizeDurationFn } from 'timed/helpers/humanize-duration'
import moment                 from 'moment'

describe('Unit | Helper | humanize duration', function() {
  it('works', function() {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = humanizeDurationFn([ duration ])

    expect(result).to.equal('3h 56m')
  })

  it('works with seconds', function() {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = humanizeDurationFn([ duration, true ])

    expect(result).to.equal('3h 56m 59s')
  })
})
