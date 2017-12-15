import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis/edit', function() {
  setupTest('controller:analysis/edit', {
    // Specify the other units that are required for this test.
    needs: [
      'service:ajax',
      'service:session',
      'service:notify',
      'controller:analysis/index'
    ]
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
