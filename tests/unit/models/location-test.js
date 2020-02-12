import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | location', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').modelFor('location')

    assert.ok(model)
  })
})
