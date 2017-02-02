import { expect }       from 'chai'
import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Controller | customers/index', function() {
  setupTest('controller:customers/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  })

  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
