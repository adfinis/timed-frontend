import { describe, it }     from 'mocha'
import { expect }           from 'chai'
import FormatDurationHelper from 'timed/helpers/format-duration'
import moment               from 'moment'

describe('Unit | Helper | format duration', function() {
  it('works', function() {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let helper = FormatDurationHelper.create()

    let result = helper.compute([ duration ])

    expect(result).to.equal('03:56:59')
  })
})
