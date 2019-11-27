import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | users/edit/credits/absence credits/edit', function(
  hooks
) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('exists', function(assert) {
    let controller = this.owner.lookup(
      'controller:users/edit/credits/absence-credits/edit'
    )
    assert.ok(controller)
  })
})
