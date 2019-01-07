import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/edit/index', function() {
  setupTest()

  it('exists', function() {
    let controller = this.subject('controller:users/edit/index')
    expect(controller).to.be.ok
  })
})
