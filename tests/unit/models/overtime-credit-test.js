import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | overtime credit', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner
      .lookup('service:store')
      .createRecord('overtime-credit')
    expect(model).to.be.ok
  })
})
