import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | overtime credit', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').modelFor('overtime-credit')

    assert.ok(model)
  })
})
