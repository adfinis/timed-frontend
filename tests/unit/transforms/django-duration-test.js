import moment              from 'moment'
import { moduleFor, test } from 'ember-qunit'

moduleFor('transform:django-duration', 'Unit | Transform | django duration', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
})

test('it correctly serializes', function(assert) {
  assert.expect(5)

  let transform = this.subject()

  assert.equal(
    transform.serialize(moment.duration({ hours: 1, minutes: 2, seconds: 3 })),
    '01:02:03'
  )

  assert.equal(
    transform.serialize(moment.duration({ hours: 100, minutes: 2, seconds: 3 })),
    '100:02:03'
  )

  assert.equal(
    transform.serialize(moment.duration({ hours: 100, minutes: 65, seconds: 3 })),
    '101:05:03'
  )

  assert.equal(
    transform.serialize(moment.duration({ hours: 100, minutes: 1, seconds: 63 })),
    '100:02:03'
  )

  assert.equal(
    transform.serialize(moment.duration({
      milliseconds: 50,
      seconds: 3,
      minutes: 2,
      hours: 1,
      days: 1,
      weeks: 1,
      months: 1,
      years: 1
    })),
    '9697:02:03'
  )
})

test('it correctly deserializes', function(assert) {
  assert.expect(6)

  const HOUR   = 3600
  const MINUTE = 60

  let transform = this.subject()

  assert.equal(transform.deserialize(''), null)
  assert.equal(transform.deserialize(null), null)

  assert.equal(
    transform.deserialize('01:02:03').asSeconds(),
    1 * HOUR +
    2 * MINUTE +
    3 // Seconds
  )

  assert.equal(
    transform.deserialize('01:02:63').asSeconds(),
    1 * HOUR +
    3 * MINUTE +
    3 // Seconds
  )

  assert.equal(
    transform.deserialize('01:62:03').asSeconds(),
    2 * HOUR +
    2 * MINUTE +
    3 // Seconds
  )

  assert.equal(
    transform.deserialize('101:02:03').asSeconds(),
    101 * HOUR +
    2 * MINUTE +
    3 // Seconds
  )
})
