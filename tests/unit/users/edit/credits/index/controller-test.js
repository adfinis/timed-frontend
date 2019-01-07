import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/edit/credits/index', function() {
  setupTest()

  it('exists', function() {
    let controller = this.owner.lookup('controller:users/edit/credits/index')
    expect(controller).to.be.ok
  })
})
