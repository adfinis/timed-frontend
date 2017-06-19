import { expect }       from 'chai'
import { describe, it } from 'mocha'
import { setupTest }    from 'ember-mocha'

describe('Unit | Route | me', function() {
  setupTest('route:me', {
    // Specify the other units that are required for this test.
    needs: [ 'service:session' ]
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
