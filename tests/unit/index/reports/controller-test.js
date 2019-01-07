import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | index/reports', function() {
  setupTest()

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.owner.lookup('controller:index/reports')
    expect(controller).to.be.ok
  })
})
