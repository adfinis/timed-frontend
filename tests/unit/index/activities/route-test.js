import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/activities', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:index/activities')
    expect(route).to.be.ok
  })
})
