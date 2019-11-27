import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | month statistic', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('exists', function(assert) {
    let model = this.owner
      .lookup('service:store')
      .createRecord('month-statistic')
    // var store = this.store();
    assert.ok(model)
  })
})
