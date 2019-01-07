import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/attendances', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:index/attendances')
    expect(route).to.be.ok
  })
})
