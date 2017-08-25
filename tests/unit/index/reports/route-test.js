import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/reports', function() {
  setupTest('route:index/reports', {
    // Specify the other units that are required for this test.
    needs: ['service:notify', 'service:tour-manager', 'service:autostart-tour']
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
