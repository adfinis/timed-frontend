import { expect } from 'chai'
import { it, describe } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | protected', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:protected')
    expect(route).to.be.ok
  })
})
