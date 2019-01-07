import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | users/index', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:users/index')
    expect(route).to.be.ok
  })
})
