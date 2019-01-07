import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | index', function() {
  setupTest()

  it('exists', function() {
    let controller = this.owner.lookup('controller:index')
    expect(controller).to.be.ok
  })
})
