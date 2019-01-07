import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | statistics', function() {
  setupTest()

  it('exists', function() {
    let controller = this.owner.lookup('controller:statistics')
    expect(controller).to.be.ok
  })
})
