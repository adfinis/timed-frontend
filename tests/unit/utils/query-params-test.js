import { module, test } from "qunit";
import {
  serializeQueryParams,
  underscoreQueryParams,
  filterQueryParams,
} from "timed/utils/query-params";

module("Unit | Utility | query params", function () {
  test("can serialize query params", function (assert) {
    const params = { foo: 10 };
    const qp = {
      foo: {
        serialize: (val) => val * 10,
      },
    };

    const result = serializeQueryParams(params, qp);

    assert.strictEqual(result.foo, 100);
  });

  test("can underline query params", function (assert) {
    const params = { fooBar: 10, "baz-x": 10 };

    const result = underscoreQueryParams(params);

    assert.deepEqual(Object.keys(result), ["foo_bar", "baz_x"]);
  });

  test("can filter params", function (assert) {
    const params = { foo: 10, bar: 10, baz: 10 };
    const result = filterQueryParams(params, "foo", "bar");

    assert.deepEqual(result, { baz: 10 });
  });
});
