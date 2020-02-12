import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import moment from 'moment'

module('Unit | Transform | django date', function(hooks) {
  setupTest(hooks)

  test('serializes', function(assert) {
    let transform = this.owner.lookup('transform:django-date')

    let result = transform.serialize(
      moment({
        y: 2017,
        M: 2, // moments months are zerobased
        d: 11
      })
    )

    assert.equal(result, '2017-03-11')
  })

  test('deserializes', function(assert) {
    let transform = this.owner.lookup('transform:django-date')

    assert.notOk(transform.deserialize(''))
    assert.notOk(transform.deserialize(null))

    let result = transform.deserialize('2017-03-11')

    assert.equal(result.year(), 2017)
    assert.equal(result.month(), 2) // moments months are zerobased
    assert.equal(result.date(), 11)
  })
})
