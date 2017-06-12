import { describe, it }     from 'mocha'
import { expect }           from 'chai'
import { formatDurationFn } from 'timed/helpers/format-duration'
import moment               from 'moment'

describe('Unit | Helper | format duration', function() {
  it('works', function() {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = formatDurationFn([ duration ])

    expect(result).to.equal('03:56:59')
  })

  it('works without seconds', function() {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = formatDurationFn([ duration, false ])

    expect(result).to.equal('03:56')
  })
})
