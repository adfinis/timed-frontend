import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | users/edit/credits', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:users/edit/credits')
    expect(route).to.be.ok
  })
})
