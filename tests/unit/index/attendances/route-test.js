import { expect }       from 'chai'
import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Route | index/attendances', function() {
  setupTest('route:index/attendances', {
    // Specify the other units that are required for this test.
    needs: [ 'service:notify' ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
