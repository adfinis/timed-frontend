import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | task', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').createRecord('task')
    // var store = this.store()
    assert.ok(model)
  })
})
