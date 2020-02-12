import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Transform | django workdays', function(hooks) {
  setupTest(hooks)

  test('serializes', function(assert) {
    let transform = this.owner.lookup('transform:django-workdays')

    let result = transform.serialize([1, 2, 3, 4, 5])

    assert.deepEqual(result, ['1', '2', '3', '4', '5'])
  })

  test('deserializes', function(assert) {
    let transform = this.owner.lookup('transform:django-workdays')

    let result = transform.deserialize(['1', '2', '3', '4', '5'])

    assert.deepEqual(result, [1, 2, 3, 4, 5])
  })
})
