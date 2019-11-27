import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | overtime credit', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('exists', function(assert) {
    let model = this.owner
      .lookup('service:store')
      .createRecord('overtime-credit')
    // var store = this.store();
    assert.ok(model)
  })
})
