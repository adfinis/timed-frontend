import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | index/activities/edit', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:index/activities/edit')
    expect(route).to.be.ok
  })
})
