import { moduleForModel, test } from 'ember-qunit'

moduleForModel('activity', 'Unit | Model | activity', {
  // Specify the other units that are required for this test.
  needs: [ 'model:task', 'model:user', 'model:activity-block' ]
})

test('it exists', function(assert) {
  let model = this.subject()
  // let store = this.store()
  assert.ok(!!model)
})
