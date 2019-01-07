import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | statistics', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:statistics')
    expect(route).to.be.ok
  })
})
