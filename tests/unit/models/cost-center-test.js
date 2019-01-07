import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | cost center', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('cost-center')
    expect(model).to.be.ok
  })
})
