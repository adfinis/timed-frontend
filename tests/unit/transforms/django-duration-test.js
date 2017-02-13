import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'
import { expect }       from 'chai'
import moment           from 'moment'

const HOUR   = 3600
const MINUTE = 60
const SECOND = 1

describe('Unit | Transform | django duration', function() {
  setupTest('transform:django-duration', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  })

  it('serializes', function() {
    let transform = this.subject()

    expect(
      transform.serialize(moment.duration({ hours: 1, minutes: 2, seconds: 3 }))
    ).to.equal(
      '01:02:03'
    )

    expect(
      transform.serialize(moment.duration({ hours: 100, minutes: 2, seconds: 3 }))
    ).to.equal(
      '100:02:03'
    )

    expect(
      transform.serialize(moment.duration({ hours: 100, minutes: 65, seconds: 3 }))
    ).to.equal(
      '101:05:03'
    )

    expect(
      transform.serialize(moment.duration({ hours: 100, minutes: 1, seconds: 63 }))
    ).to.equal(
      '100:02:03'
    )

    expect(
      transform.serialize(moment.duration({
        milliseconds: 50,
        seconds: 3,
        minutes: 2,
        hours: 1,
        days: 1,
        weeks: 1,
        months: 1,
        years: 1
      }))
    ).to.equal(
      '9697:02:03'
    )
  })

  it('deserializes', function() {
    let transform = this.subject()

    expect(transform.deserialize('')).to.be.null
    expect(transform.deserialize(null)).to.be.null

    expect(
      transform.deserialize('01:02:03').asSeconds()
    ).to.equal(
      1 * HOUR + 2 * MINUTE + 3 * SECOND
    )

    expect(
      transform.deserialize('01:02:63').asSeconds()
    ).to.equal(
      1 * HOUR + 3 * MINUTE + 3 * SECOND
    )

    expect(
      transform.deserialize('01:62:03').asSeconds()
    ).to.equal(
      2 * HOUR + 2 * MINUTE + 3 * SECOND
    )

    expect(
      transform.deserialize('101:02:03').asSeconds()
    ).to.equal(
      101 * HOUR + 2 * MINUTE + 3 * SECOND
    )
  })
})
