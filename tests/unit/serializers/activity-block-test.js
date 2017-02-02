import { describe, it }   from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect }         from 'chai'

describe('Unit | Serializer | activity block', function() {
  setupModelTest('activity-block', {
    needs: [
      'serializer:activity-block',
      'model:activity',
      'transform:django-datetime'
    ]
  })

  it('serializes records', function() {
    let record = this.subject()

    let serializedRecord = record.serialize()

    expect(serializedRecord).to.be.ok
  })
})
