import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | cost center', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').modelFor('cost-center')

    assert.ok(model)
  })
})
