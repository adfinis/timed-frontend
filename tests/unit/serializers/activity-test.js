import { describe, it }   from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect }         from 'chai'

describe('Unit | Serializer | activity', function() {
  setupModelTest('activity', {
    needs: [
      'serializer:activity',
      'transform:django-datetime',
      'transform:django-duration',
      'model:activity-block',
      'model:task',
      'model:user'
    ]
  })

  it('serializes records', function() {
    let record = this.subject()

    let serializedRecord = record.serialize()

    expect(serializedRecord).to.be.ok
  })
})
