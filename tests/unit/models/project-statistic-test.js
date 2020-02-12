import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Model | project statistic', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let model = this.owner.lookup('service:store').modelFor('project-statistic')

    assert.ok(model)
  })
})
