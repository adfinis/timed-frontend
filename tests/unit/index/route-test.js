import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index', function() {
  setupTest('route:index', {
    // Specify the other units that are required for this test.
    needs: [
      'service:notify',
      'service:session',
      'service:tour-manager',
      'service:autostart-tour'
    ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
