import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | activity', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('activity')
    expect(model).to.be.ok
  })
})
