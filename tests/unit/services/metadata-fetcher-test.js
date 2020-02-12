import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | metadata fetcher', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let service = this.owner.lookup('service:metadata-fetcher')
    assert.ok(service)
  })
})
