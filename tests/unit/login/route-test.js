import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | login', function() {
  setupTest('route:login', {
    // Specify the other units that are required for this test.
    needs: ['service:session']
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
