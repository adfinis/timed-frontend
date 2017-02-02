import { expect }       from 'chai'
import { it, describe } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Route | customers/edit', function() {
  setupTest('route:customers/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
