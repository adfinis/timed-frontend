import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Model | task statistic', function() {
  setupTest()

  it('exists', function() {
    let model = this.owner
      .lookup('service:store')
      .createRecord('task-statistic')
    expect(model).to.be.ok
  })
})
