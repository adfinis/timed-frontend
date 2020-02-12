import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Route | analysis/edit', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let route = this.owner.lookup('route:analysis/edit')
    assert.ok(route)
  })
})
