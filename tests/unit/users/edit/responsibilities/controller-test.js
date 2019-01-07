import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/edit/responsibilities', function() {
  setupTest()

  it('exists', function() {
    let controller = this.owner.lookup('controller:users/edit/responsibilities')
    expect(controller).to.be.ok
  })
})
