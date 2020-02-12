import { module, test } from 'qunit'
import { formatDurationFn } from 'timed/helpers/format-duration'
import moment from 'moment'

module('Unit | Helper | format duration', function() {
  test('works', function(assert) {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = formatDurationFn([duration])

    assert.equal(result, '03:56:59')
  })

  test('works without seconds', function(assert) {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = formatDurationFn([duration, false])

    assert.equal(result, '03:56')
  })
})
