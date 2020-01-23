import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { trackingStub } from 'timed/tests/integration/components/tracking-bar/component-test'

module('Unit | Controller | index', function(hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    this.owner.register('service:tracking', trackingStub)
  })

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:index')
    assert.ok(controller)
  })
})
