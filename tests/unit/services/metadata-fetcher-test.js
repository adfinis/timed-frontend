import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Service | metadata fetcher', function() {
  setupTest()

  it('exists', function() {
    let service = this.owner.lookup('service:metadata-fetcher')
    expect(service).to.be.ok
  })
})
