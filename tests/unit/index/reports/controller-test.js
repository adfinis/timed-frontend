import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | index/reports', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:index/reports')
    assert.ok(controller)
  })
})
