import { expect }       from 'chai'
import { it, describe } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Controller | index', function() {
  setupTest('controller:index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  })

  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
