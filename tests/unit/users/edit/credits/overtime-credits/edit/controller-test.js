import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | users/edit/credits/overtime credits/edit', function(
  hooks
) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup(
      'controller:users/edit/credits/overtime-credits/edit'
    )
    assert.ok(controller)
  })
})
