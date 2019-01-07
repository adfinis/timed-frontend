import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | analysis/edit', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:analysis/edit')
    expect(route).to.be.ok
  })
})
