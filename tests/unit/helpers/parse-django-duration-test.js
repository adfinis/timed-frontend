import { module, test } from 'qunit'
import { parseDjangoDurationFn } from 'timed/helpers/parse-django-duration'

module('Unit | Helper | parse django duration', function() {
  test('works', function(assert) {
    let result = parseDjangoDurationFn(['11:30:00'])

    assert.equal(result.asHours(), 11.5)
  })

  test('works with a negative duration', function(assert) {
    let result = parseDjangoDurationFn(['-1 11:30:00'])

    assert.equal(result.asHours(), -12.5)
  })
})
