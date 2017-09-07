import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Service | metadata fetcher', function() {
  setupTest('service:metadata-fetcher', {
    // Specify the other units that are required for this test.
    needs: ['service:ajax']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let service = this.subject()
    expect(service).to.be.ok
  })
})
