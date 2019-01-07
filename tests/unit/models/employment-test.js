import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | employment', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('employment')
    expect(model).to.be.ok
  })
})
