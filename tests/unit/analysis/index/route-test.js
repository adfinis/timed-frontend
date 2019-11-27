import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | analysis/index', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:analysis/index')
    assert.ok(route)
  })
})
