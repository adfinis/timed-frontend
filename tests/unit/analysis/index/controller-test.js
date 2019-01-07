import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis/index', function() {
  setupTest()

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.owner.lookup('controller:analysis/index')
    expect(controller).to.be.ok
  })
})
