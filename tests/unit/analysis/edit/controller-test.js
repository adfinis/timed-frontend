import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | analysis/edit', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:analysis/index')
    assert.ok(controller)
  })
})
