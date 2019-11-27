import { module, test } from 'qunit'
import { cleanParams, toQueryString } from 'timed/utils/url'

module('Unit | Utility | url', function() {
  // Replace this with your real tests.
  test('can clean params', function(assert) {
    let params = {
      1: '',
      2: null,
      3: undefined,
      4: 0,
      5: 'test'
    }

    let result = cleanParams(params)

    assert.deepEqual(result, {
      1: '',
      4: 0,
      5: 'test'
    })
  })

  test('can convert params to a query string', function(assert) {
    let params = {
      foo: '',
      bar: 0,
      baz: 'test'
    }

    let result = toQueryString(params)

    assert.equal(result, 'foo=&bar=0&baz=test')
  })
})
