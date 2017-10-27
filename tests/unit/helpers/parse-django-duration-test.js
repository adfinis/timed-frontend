import { describe, it } from 'mocha'
import { expect } from 'chai'
import { parseDjangoDurationFn } from 'timed/helpers/parse-django-duration'

describe('Unit | Helper | parse django duration', function() {
  it('works', function() {
    let result = parseDjangoDurationFn(['11:30:00'])

    expect(result.asHours()).to.equal(11.5)
  })

  it('works with a negative duration', function() {
    let result = parseDjangoDurationFn(['-1 11:30:00'])

    expect(result.asHours()).to.equal(-12.5)
  })
})
