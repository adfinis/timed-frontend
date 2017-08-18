import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | reschedule', function() {
  setupTest('route:reschedule', {
    // Specify the other units that are required for this test.
    needs: ['service:ajax']
  })

  it('exists', function() {
    let route = this.subject()
    expect(route).to.be.ok
  })
})
