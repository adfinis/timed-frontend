import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Serializer | attendance', function() {
  setupTest()

  it('serializes records', function() {
    let record = this.owner.lookup('service:store').createRecord('attendance')

    let serializedRecord = record.serialize()

    expect(serializedRecord).to.be.ok
  })
})
