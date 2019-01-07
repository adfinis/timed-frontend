import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Model | project', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner.lookup('service:store').createRecord('project')
    expect(model).to.be.ok
  })
})
