import { describe, it } from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | activity', function() {
  setupModelTest('activity', {
    needs: ['model:activity-block', 'model:task', 'model:user']
  })

  it('exists', function() {
    let model = this.subject()
    // var store = this.store()
    expect(model).to.be.ok
  })
})
