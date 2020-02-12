import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | protected', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:protected')
    assert.ok(route)
  })
})
