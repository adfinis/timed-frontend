import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | report intersection', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner
      .lookup('service:store')
      .createRecord('report-intersection')
    expect(model).to.be.ok
  })
})
