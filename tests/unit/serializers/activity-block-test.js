import { moduleForModel, test } from 'ember-qunit'

moduleForModel('activity-block', 'Unit | Serializer | activity block', {
  // Specify the other units that are required for this test.
  needs: [
    'serializer:activity-block',
    'transform:django-datetime',
    'model:activity-block',
    'model:activity'
  ]
})

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject()

  let serializedRecord = record.serialize()

  assert.ok(serializedRecord)
})
