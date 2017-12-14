import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis/index', function() {
  setupTest('controller:analysis/index', {
    // Specify the other units that are required for this test.
    needs: ['service:can', 'service:session', 'service:notify']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
