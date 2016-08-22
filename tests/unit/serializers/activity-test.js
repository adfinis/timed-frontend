import { moduleForModel, test } from 'ember-qunit'

moduleForModel('activity', 'Unit | Serializer | activity', {
  // Specify the other units that are required for this test.
  needs: [
    'serializer:activity',
    'transform:django-duration',
    'transform:django-datetime',
    'model:activity-block',
    'model:activity',
    'model:task',
    'model:user'
  ]
})

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject()

  let serializedRecord = record.serialize()

  assert.ok(serializedRecord)
})
