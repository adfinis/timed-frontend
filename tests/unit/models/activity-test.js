import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | activity', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').createRecord('activity')
    // var store = this.store()
    assert.ok(model)
  })
})
