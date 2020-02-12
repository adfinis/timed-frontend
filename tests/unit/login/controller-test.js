import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | login', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:login')
    assert.ok(controller)
  })
})
