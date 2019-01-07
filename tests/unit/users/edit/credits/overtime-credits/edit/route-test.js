import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | users/edit/credits/overtime credits/edit', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup(
      'route:users/edit/credits/overtime-credits/edit'
    )
    expect(route).to.be.ok
  })
})
