import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | report intersection', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner
      .lookup('service:store')
      .modelFor('report-intersection')

    assert.ok(model)
  })
})
