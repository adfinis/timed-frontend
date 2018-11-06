import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | protected', function() {
  setupTest('controller:protected', {
    // Specify the other units that are required for this test.
    needs: ['model:activity', 'model:task', 'model:user']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
