import { expect } from 'chai'
import { describe, it } from 'mocha'
import humanizeDuration from 'timed/utils/humanize-duration'
import moment from 'moment'

describe('Unit | Utility | humanize duration', function() {
  it('works', function() {
    let duration = moment.duration({
      hours: 11,
      minutes: 12,
      seconds: 13
    })

    let result = humanizeDuration(duration)

    expect(result).to.equal('11h 12m')
  })

  it('works with seconds', function() {
    let duration = moment.duration({
      hours: 11,
      minutes: 12,
      seconds: 13
    })

    let result = humanizeDuration(duration, true)

    expect(result).to.equal('11h 12m 13s')
  })

  it('renders days as hours', function() {
    let duration = moment.duration({
      days: 2,
      hours: 2,
      minutes: 0
    })

    let result = humanizeDuration(duration)

    expect(result).to.equal('50h 0m')
  })

  it('has a fallback', function() {
    let result = humanizeDuration(null)

    expect(result).to.equal('0h 0m')
  })

  it('has a fallback with seconds', function() {
    let result = humanizeDuration(null, true)

    expect(result).to.equal('0h 0m 0s')
  })

  it('splits big numbers', function() {
    let hours = 1000000

    let duration = moment.duration({ hours })

    let result = humanizeDuration(duration)

    expect(result).to.equal(`${hours.toLocaleString('de-CH')}h 0m`)
  })

  it('works with negative durations', function() {
    let result = humanizeDuration(moment.duration({ hours: -4, minutes: -30 }))

    expect(result).to.equal('-4h 30m')
  })
})
