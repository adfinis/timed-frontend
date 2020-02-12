import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | users/edit/index', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:users/edit/index')
    assert.ok(controller)
  })
})
