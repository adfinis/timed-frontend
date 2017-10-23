import { expect } from 'chai'
import { describe, it } from 'mocha'
import parseDjangoDuration from 'timed/utils/parse-django-duration'
import moment from 'moment'

describe('Unit | Utility | parse django duration', function() {
  it('works', function() {
    expect(parseDjangoDuration('')).to.be.null
    expect(parseDjangoDuration(null)).to.be.null

    expect(parseDjangoDuration('01:02:03').asMilliseconds()).to.equal(
      moment
        .duration({
          hours: 1,
          minutes: 2,
          seconds: 3
        })
        .asMilliseconds()
    )

    expect(parseDjangoDuration('1 02:03:04').asMilliseconds()).to.equal(
      moment
        .duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4
        })
        .asMilliseconds()
    )

    expect(parseDjangoDuration('01:02:03.004000').asMilliseconds()).to.equal(
      moment
        .duration({
          hours: 1,
          minutes: 2,
          seconds: 3,
          milliseconds: 4
        })
        .asMilliseconds()
    )

    expect(parseDjangoDuration('1 02:03:04.005000').asMilliseconds()).to.equal(
      moment
        .duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 5
        })
        .asMilliseconds()
    )

    expect(parseDjangoDuration('-1 22:57:57').asMilliseconds()).to.equal(
      moment
        .duration({
          hours: -1,
          minutes: -2,
          seconds: -3
        })
        .asMilliseconds()
    )

    expect(parseDjangoDuration('-10 22:57:57').asMilliseconds()).to.equal(
      moment
        .duration({
          days: -9,
          hours: -1,
          minutes: -2,
          seconds: -3
        })
        .asMilliseconds()
    )
  })
})
