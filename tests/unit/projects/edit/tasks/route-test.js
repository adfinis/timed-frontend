import { expect }       from 'chai'
import { it, describe } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Route | projects/edit/tasks', function() {
  setupTest('route:projects/edit/tasks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
