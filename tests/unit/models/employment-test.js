import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | employment', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').createRecord('employment')
    // var store = this.store()
    assert.ok(model)
  })
})
