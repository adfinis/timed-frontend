import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import moment from 'moment'

module('Unit | Transform | django time', function(hooks) {
  setupTest(hooks)

  test('serializes', function(assert) {
    let transform = this.owner.lookup('transform:django-time')

    let result = transform.serialize(
      moment({
        hour: 12,
        minute: 12,
        second: 12
      })
    )

    assert.equal(result, '12:12:12')

    let result2 = transform.serialize(
      moment({
        hour: 8,
        minute: 8,
        second: 8
      })
    )

    assert.equal(result2, '08:08:08')
  })

  test('deserializes', function(assert) {
    let transform = this.owner.lookup('transform:django-time')

    let result = transform.deserialize('12:12:12')

    assert.equal(result.hour(), 12)
    assert.equal(result.minute(), 12)
    assert.equal(result.second(), 12)

    let result2 = transform.deserialize('08:08:08')

    assert.equal(result2.hour(), 8)
    assert.equal(result2.minute(), 8)
    assert.equal(result2.second(), 8)
  })
})
