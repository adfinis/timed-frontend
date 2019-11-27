import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | index/activities', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:index/activities')
    assert.ok(route)
  })
})
