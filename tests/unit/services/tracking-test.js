import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { settled } from '@ember/test-helpers'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Unit | Service | tracking', function(hooks) {
  setupTest(hooks)
  setupMirage(hooks)

  test('exists', async function(assert) {
    let service = this.owner.lookup('service:tracking')
    await settled()
    assert.ok(service)
  })
})
