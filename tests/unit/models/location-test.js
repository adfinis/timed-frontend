import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | location', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('location')
    expect(model).to.be.ok
  })
})
