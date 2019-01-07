import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/reports', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:index/reports')
    expect(route).to.be.ok
  })
})
