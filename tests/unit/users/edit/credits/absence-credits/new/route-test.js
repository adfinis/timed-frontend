import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | users/edit/credits/absence credits/new', function(
  hooks
) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup(
      'route:users/edit/credits/absence-credits/new'
    )
    assert.ok(route)
  })
})
