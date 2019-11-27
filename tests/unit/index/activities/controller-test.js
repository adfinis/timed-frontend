import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | index/activities', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:index/activities')
    assert.ok(controller)
  })
})
