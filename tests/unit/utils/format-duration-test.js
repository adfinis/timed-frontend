import { module, test } from 'qunit'
import formatDuration from 'timed/utils/format-duration'
import moment from 'moment'

module('Unit | Utility | format duration', function() {
  test('works', function(assert) {
    let duration = moment.duration({
      hours: 11,
      minutes: 50,
      seconds: 15
    })

    let result = formatDuration(duration)

    assert.equal(result, '11:50:15')
  })

  test('converts days into hours', function(assert) {
    let duration = moment.duration({
      hours: 44,
      minutes: 24,
      seconds: 19
    })

    let result = formatDuration(duration)

    assert.equal(result, '44:24:19')
  })

  test('zeropads all numbers', function(assert) {
    let duration = moment.duration({
      hours: 1,
      minutes: 1,
      seconds: 1
    })

    let result = formatDuration(duration)

    assert.equal(result, '01:01:01')
  })

  test('can hide seconds', function(assert) {
    let duration = moment.duration({
      hours: 22,
      minutes: 12
    })

    let result = formatDuration(duration, false)

    assert.equal(result, '22:12')
  })

  test('can be negative', function(assert) {
    let duration = moment.duration({
      hours: -1,
      minutes: -1,
      seconds: -1
    })

    let result = formatDuration(duration)

    assert.equal(result, '-01:01:01')
  })

  test('has a fallback', function(assert) {
    let result1 = formatDuration(null)

    assert.equal(result1, '--:--:--')

    let result2 = formatDuration(null, false)

    assert.equal(result2, '--:--')
  })

  test('works with a number instead of a duration', function(assert) {
    let num = 11 * 60 * 60 * 1000 + 12 * 60 * 1000 + 13 * 1000

    let result1 = formatDuration(num)

    assert.equal(result1, '11:12:13')

    let result2 = formatDuration(num, false)

    assert.equal(result2, '11:12')
  })
})
