import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | customer statistic', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner
      .lookup('service:store')
      .createRecord('customer-statistic')
    expect(model).to.be.ok
  })
})
