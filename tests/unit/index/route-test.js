import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:index')
    expect(route).to.be.ok
  })
})
