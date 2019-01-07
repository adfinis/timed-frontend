import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'

describe('Unit | Model | attendance', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('attendance')
    expect(model).to.be.ok
  })

  it('calculates the duration', function() {
    let model = this.owner.lookup('service:store').createRecord('attendance', {
      from: moment({ h: 8, m: 0, s: 0 }),
      to: moment({ h: 17, m: 0, s: 0 })
    })

    expect(model.get('duration').asHours()).to.equal(9)
  })

  it('calculates the duration when the end time is 00:00', function() {
    let model = this.owner.lookup('service:store').createRecord('attendance', {
      from: moment({ h: 0, m: 0, s: 0 }),
      to: moment({ h: 0, m: 0, s: 0 })
    })

    expect(model.get('duration').asHours()).to.equal(24)
  })
})
