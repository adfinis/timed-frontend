import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/activities', function() {
  setupTest('route:index/activities', {
    // Specify the other units that are required for this test.
    needs: [
      'service:notify',
      'service:tracking',
      'service:tour-manager',
      'service:autostart-tour'
    ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
