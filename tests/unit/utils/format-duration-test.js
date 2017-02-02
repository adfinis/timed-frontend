import { describe, it } from 'mocha'
import { expect }       from 'chai'
import formatDuration   from 'timed/utils/format-duration'
import moment           from 'moment'

describe('Unit | Utility | format duration', function() {
  it('works', function() {
    let duration = moment.duration({
      hours: 11,
      minutes: 50,
      seconds: 15
    })

    let result = formatDuration(duration)

    expect(result).to.equal('11:50:15')
  })

  it('converts days into hours', function() {
    let duration = moment.duration({
      hours: 44,
      minutes: 24,
      seconds: 19
    })

    let result = formatDuration(duration)

    expect(result).to.equal('44:24:19')
  })

  it('zeropads all numbers', function() {
    let duration = moment.duration({
      hours: 1,
      minutes: 1,
      seconds: 1
    })

    let result = formatDuration(duration)

    expect(result).to.equal('01:01:01')
  })

  it('zeropads all numbers', function() {
    let duration = moment.duration({
      hours: 22,
      minutes: 12
    })

    let result = formatDuration(duration, false)

    expect(result).to.equal('22:12')
  })
})
