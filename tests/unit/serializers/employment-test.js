import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Serializer | employment', function() {
  setupTest()

  it('serializes records', function() {
    let record = this.owner.lookup('service:store').createRecord('employment')

    let serializedRecord = record.serialize()

    expect(serializedRecord).to.be.ok
  })
})
