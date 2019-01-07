import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Route | analysis/index', function() {
  setupTest()

  it('exists', function() {
    let route = this.owner.lookup('route:analysis/index')
    expect(route).to.be.ok
  })
})
