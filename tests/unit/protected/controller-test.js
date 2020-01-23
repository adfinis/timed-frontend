import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | protected', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:protected')
    assert.ok(controller)
  })
})
