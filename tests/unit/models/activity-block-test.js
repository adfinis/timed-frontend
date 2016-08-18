import { moduleForModel, test } from 'ember-qunit'

moduleForModel('activity-block', 'Unit | Model | activity block', {
  // Specify the other units that are required for this test.
  needs: [ 'model:activity' ]
})

test('it exists', function(assert) {
  let model = this.subject()
  // let store = this.store()
  assert.ok(!!model)
})
