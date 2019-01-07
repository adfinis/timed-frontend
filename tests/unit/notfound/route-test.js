import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | notfound', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:notfound')
    expect(route).to.be.ok
  })
})
