import { expect }       from 'chai'
import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Route | index/activities/edit', function() {
  setupTest('route:index/activities/edit', {
    // Specify the other units that are required for this test.
    needs: [ 'service:notify' ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
