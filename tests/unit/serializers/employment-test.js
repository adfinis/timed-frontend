import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Serializer | employment', function(hooks) {
  setupTest(hooks)

  test('serializes records', function(assert) {
    let record = this.owner.lookup('service:store').createRecord('employment')

    let serializedRecord = record.serialize()

    assert.ok(serializedRecord)
  })
})
