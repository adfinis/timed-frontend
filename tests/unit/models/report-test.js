import { describe, it } from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | report', function() {
  setupModelTest('report', {
    needs: [
      'model:project',
      'model:task',
      'model:user',
      'model:activity',
      'model:absence-type'
    ]
  })

  it('exists', function() {
    let model = this.subject()
    // var store = this.store()
    expect(model).to.be.ok
  })
})
