import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Adapter | report user', function() {
  setupTest('adapter:report-user', {
    // Specify the other units that are required for this test.
    needs: ['service:session']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let adapter = this.subject()
    expect(adapter).to.be.ok
  })
})
