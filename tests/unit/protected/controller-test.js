import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | protected', function() {
  setupTest()

  it('exists', function() {
    let controller = this.owner.lookup('controller:protected')
    expect(controller).to.be.ok
  })
})
