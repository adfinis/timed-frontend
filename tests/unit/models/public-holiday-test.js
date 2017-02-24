import { describe, it }   from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect }         from 'chai'

describe('Unit | Model | public holiday', function() {
  setupModelTest('public-holiday', {
    needs: [ 'model:location', 'transform:django-date' ]
  })

  it('exists', function() {
    let model = this.subject()
    // var store = this.store()
    expect(model).to.be.ok
  })
})
