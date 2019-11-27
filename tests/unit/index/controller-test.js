import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { trackingStub } from 'timed/tests/integration/components/tracking-bar/component-test'

module('Unit | Controller | index', function(hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    this.register('service:tracking', trackingStub)
    this.inject.service('tracking', { as: 'tracking' })
  })

  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:index')
    assert.ok(controller)
  })
})
