import { module, test } from "qunit";
import validateNullOrNotBlank from "timed/validators/null-or-not-blank";

module("Unit | Validator | null or not blank", function() {
  test("works", function(assert) {
    assert.true(validateNullOrNotBlank()("key", "test"));
    assert.true(validateNullOrNotBlank()("key", null));
    assert.equal(typeof validateNullOrNotBlank()("key", ""), "string");
  });
});
