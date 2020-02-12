import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | index/activities/edit', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:index/activities/edit')
    assert.ok(controller)
  })
})
