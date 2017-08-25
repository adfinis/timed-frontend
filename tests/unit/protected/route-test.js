import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | protected', function() {
  setupTest('route:protected', {
    // Specify the other units that are required for this test.
    needs: [
      'service:session',
      'service:tour-manager',
      'service:autostart-tour',
      'service:notify'
    ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
