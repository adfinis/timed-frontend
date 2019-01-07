import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis/edit', function() {
  setupTest()

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.owner.lookup('controller:analysis/edit')
    expect(controller).to.be.ok
  })
})
