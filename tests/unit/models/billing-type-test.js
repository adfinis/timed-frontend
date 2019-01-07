import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | billing type', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('billing-type')
    expect(model).to.be.ok
  })
})
