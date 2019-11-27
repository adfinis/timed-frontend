import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | index/activities/edit', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:index/activities/edit')
    assert.ok(route)
  })
})
