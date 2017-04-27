import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'
import { expect }       from 'chai'
import moment           from 'moment'

describe('Unit | Transform | django duration', function() {
  setupTest('transform:django-duration', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  })

  it('serializes', function() {
    let transform = this.subject()

    expect(transform.serialize(null)).to.be.null

    expect(
      transform.serialize(moment.duration({
        hours: 1,
        minutes: 2,
        seconds: 3
      }))
    ).to.equal(
      '01:02:03'
    )

    expect(
      transform.serialize(moment.duration({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4
      }))
    ).to.equal(
      '1 02:03:04'
    )

    expect(
      transform.serialize(moment.duration({
        hours: 1,
        minutes: 2,
        seconds: 3,
        milliseconds: 4
      }))
    ).to.equal(
      '01:02:03.004000'
    )

    expect(
      transform.serialize(moment.duration({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 5
      }))
    ).to.equal(
      '1 02:03:04.005000'
    )

    expect(
      transform.serialize(moment.duration({
        hours: -1,
        minutes: -2,
        seconds: -3
      }))
    ).to.equal(
      '-1 22:57:57'
    )
  })

  it('deserializes', function() {
    let transform = this.subject()

    expect(transform.deserialize('')).to.be.null
    expect(transform.deserialize(null)).to.be.null

    expect(
      transform.deserialize('01:02:03').asMilliseconds()
    ).to.equal(
      moment.duration({
        hours: 1,
        minutes: 2,
        seconds: 3
      }).asMilliseconds()
    )

    expect(
      transform.deserialize('1 02:03:04').asMilliseconds()
    ).to.equal(
      moment.duration({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4
      }).asMilliseconds()
    )

    expect(
      transform.deserialize('01:02:03.004000').asMilliseconds()
    ).to.equal(
      moment.duration({
        hours: 1,
        minutes: 2,
        seconds: 3,
        milliseconds: 4
      }).asMilliseconds()
    )

    expect(
      transform.deserialize('1 02:03:04.005000').asMilliseconds()
    ).to.equal(
      moment.duration({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 5
      }).asMilliseconds()
    )

    expect(
      transform.deserialize('-1 22:57:57').asMilliseconds()
    ).to.equal(
      moment.duration({
        hours: -1,
        minutes: -2,
        seconds: -3
      }).asMilliseconds()
    )
  })
})
