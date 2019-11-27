import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Serializer | attendance', function(hooks) {
  setupTest(hooks)

  test('serializes records', function(assert) {
    let record = this.owner.lookup('service:store').createRecord('attendance')

    let serializedRecord = record.serialize()

    assert.ok(serializedRecord)
  })
})
