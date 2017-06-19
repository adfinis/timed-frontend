import { describe, it } from 'mocha'
import { expect }       from 'chai'
import { setupTest }    from 'ember-mocha'

describe('Unit | Adapter | activity block', function() {
  setupTest('adapter:activity-block', {
    // Specify the other units that are required for this test.
    needs: [ 'service:session' ]
  })

  it('exists', function() {
    let adapter = this.subject()
    expect(adapter).to.be.ok
  })
})
