import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/index', function() {
  setupTest('controller:users/index', {
    // Specify the other units that are required for this test.
    needs: ['service:session']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
