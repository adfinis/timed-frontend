import { module, test } from 'qunit'
import { humanizeDurationFn } from 'timed/helpers/humanize-duration'
import moment from 'moment'

module('Unit | Helper | humanize duration', function() {
  test('works', function(assert) {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = humanizeDurationFn([duration])

    assert.equal(result, '3h 56m')
  })

  test('works with seconds', function(assert) {
    let duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    })

    let result = humanizeDurationFn([duration, true])

    assert.equal(result, '3h 56m 59s')
  })
})
