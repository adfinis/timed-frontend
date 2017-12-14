import { expect } from 'chai'
import { describe, it } from 'mocha'
import {
  serializeParachuteQueryParams,
  underscoreQueryParams
} from 'timed/utils/query-params'

describe('Unit | Utility | query params', function() {
  it('can serialize parachute query params', function() {
    let params = { foo: 10 }
    let qp = {
      queryParams: {
        foo: {
          serialize: val => val * 10
        }
      }
    }

    let result = serializeParachuteQueryParams(params, qp)

    expect(result.foo).to.equal(100)
  })

  it('can underline query params', function() {
    let params = { fooBar: 10, 'baz-x': 10 }

    let result = underscoreQueryParams(params)

    expect(Object.keys(result)).to.deep.equal(['foo_bar', 'baz_x'])
  })
})
