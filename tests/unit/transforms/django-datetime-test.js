import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import moment from 'moment'

module('Unit | Transform | django datetime', function(hooks) {
  setupTest(hooks)

  test('serializes', function(assert) {
    let transform = this.owner.lookup('transform:django-datetime')

    let zone = moment().utcOffset()

    let datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11
    }).utcOffset(zone)

    let result = transform.serialize(datetime)

    assert.equal(result, datetime.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'))
  })

  test('deserializes', function(assert) {
    let transform = this.owner.lookup('transform:django-datetime')

    let datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11
    }).utc()

    assert.notOk(transform.deserialize(''))
    assert.notOk(transform.deserialize(null))

    let result = transform
      .deserialize(datetime.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'))
      .utc()

    assert.equal(result.toISOString(), datetime.toISOString())
  })
})
