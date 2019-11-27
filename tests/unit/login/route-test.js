import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | login', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:login')
    assert.ok(route)
  })
})
