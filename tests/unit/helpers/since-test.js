import { describe, it } from 'mocha'
import { expect }       from 'chai'
import SinceHelper      from 'timed/helpers/since'
import moment           from 'moment'

describe('Unit | Helper | since', function() {
  it('works', function() {
    let start = moment().subtract(5, 'minutes')

    let helper = SinceHelper.create()

    let result = helper.compute([ start ])

    expect(result).to.equal('00:05:00')
  })

  it('works with elapsed time', function() {
    let start = moment().subtract({
      minutes: 11,
      seconds: 14
    })

    let elapsed = moment.duration({
      hours: 1,
      minutes: 10,
      seconds: 1
    })

    let helper = SinceHelper.create()

    let result = helper.compute([ start, elapsed ])

    expect(result).to.equal('01:21:15')
  })
})
