import { expect } from 'chai'
import { describe, it } from 'mocha'
import { cleanParams, toQueryString } from 'timed/utils/url'

describe('Unit | Utility | url', function() {
  // Replace this with your real tests.
  it('can clean params', function() {
    let params = {
      1: '',
      2: null,
      3: undefined,
      4: 0,
      5: 'test'
    }

    let result = cleanParams(params)

    expect(result).to.deep.equal({
      1: '',
      4: 0,
      5: 'test'
    })
  })

  it('can convert params to a query string', function() {
    let params = {
      foo: '',
      bar: 0,
      baz: 'test'
    }

    let result = toQueryString(params)

    expect(result).to.equal('foo=&bar=0&baz=test')
  })
})
