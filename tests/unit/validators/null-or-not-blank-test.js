import { expect } from 'chai'
import { describe, it } from 'mocha'
import validateNullOrNotBlank from 'timed/validators/null-or-not-blank'

describe('Unit | Validator | null or not blank', function() {
  it('works', function() {
    expect(validateNullOrNotBlank()('key', 'test')).to.be.true
    expect(validateNullOrNotBlank()('key', null)).to.be.true
    expect(validateNullOrNotBlank()('key', '')).to.be.a('string')
  })
})
