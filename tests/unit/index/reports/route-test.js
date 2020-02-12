import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | index/reports', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:index/reports')
    assert.ok(route)
  })
})
