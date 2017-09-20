import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'

describe('Unit | Transform | django time', function() {
  setupTest('transform:django-time', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  })

  it('serializes', function() {
    let transform = this.subject()

    let result = transform.serialize(
      moment({
        hour: 12,
        minute: 12,
        second: 12
      })
    )

    expect(result).to.equal('12:12:12')

    let result2 = transform.serialize(
      moment({
        hour: 8,
        minute: 8,
        second: 8
      })
    )

    expect(result2).to.equal('08:08:08')
  })

  it('deserializes', function() {
    let transform = this.subject()

    let result = transform.deserialize('12:12:12')

    expect(result.hour()).to.equal(12)
    expect(result.minute()).to.equal(12)
    expect(result.second()).to.equal(12)

    let result2 = transform.deserialize('08:08:08')

    expect(result2.hour()).to.equal(8)
    expect(result2.minute()).to.equal(8)
    expect(result2.second()).to.equal(8)
  })
})
