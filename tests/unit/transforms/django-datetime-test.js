import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'
import { expect }       from 'chai'
import moment           from 'moment'

describe('Unit | Transform | django datetime', function() {
  setupTest('transform:django-datetime', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  })

  it('serializes', function() {
    let transform = this.subject()

    let zone = moment().utcOffset()

    let datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11
    }).utcOffset(zone)

    let result = transform.serialize(datetime)

    expect(result).to.equal(datetime.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'))
  })

  it('deserializes', function() {
    let transform = this.subject()

    let zone = moment().utcOffset()

    let datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11
    }).utcOffset(zone)

    expect(transform.deserialize('')).to.be.null
    expect(transform.deserialize(null)).to.be.null

    let result = transform.deserialize(datetime.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'))

    expect(result.year()).to.equal(2017)
    expect(result.month()).to.equal(2) // moments months are zerobased
    expect(result.date()).to.equal(11)
    expect(result.hour()).to.equal(15)
    expect(result.minute()).to.equal(30)
    expect(result.second()).to.equal(50)
    expect(result.utcOffset()).to.equal(moment().utcOffset())
  })
})
