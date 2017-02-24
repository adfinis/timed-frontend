import { describe, it }   from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect }         from 'chai'

describe('Unit | Model | employment', function() {
  setupModelTest('employment', {
    needs: [
      'model:user',
      'model:location',
      'transform:django-date',
      'transform:django-duration'
    ]
  })

  it('exists', function() {
    let model = this.subject()
    // var store = this.store()
    expect(model).to.be.ok
  })
})
