import { module, test } from 'qunit'
import validateNullOrNotBlank from 'timed/validators/null-or-not-blank'

module('Unit | Validator | null or not blank', function() {
  test('works', function(assert) {
    assert.equal(validateNullOrNotBlank()('key', 'test'), true)
    assert.equal(validateNullOrNotBlank()('key', null), true)
    assert.equal(typeof validateNullOrNotBlank()('key', ''), 'string')
  })
})
