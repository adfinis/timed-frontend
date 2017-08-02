import { describe, it } from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Serializer | employment', function() {
  setupModelTest('employment', {
    needs: [
      'serializer:employment',
      'transform:django-duration',
      'transform:django-date',
      'model:user',
      'model:location'
    ]
  })

  it('serializes records', function() {
    let record = this.subject()

    let serializedRecord = record.serialize()

    expect(serializedRecord).to.be.ok
  })
})
