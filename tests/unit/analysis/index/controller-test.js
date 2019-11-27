import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | analysis/index', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:analysis/index')
    assert.ok(controller)
  })
})
