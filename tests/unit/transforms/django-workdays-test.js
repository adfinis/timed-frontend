import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Transform | django workdays", function(hooks) {
  setupTest(hooks);

  test("serializes", function(assert) {
    const transform = this.owner.lookup("transform:django-workdays");

    const result = transform.serialize([1, 2, 3, 4, 5]);

    assert.deepEqual(result, ["1", "2", "3", "4", "5"]);
  });

  test("deserializes", function(assert) {
    const transform = this.owner.lookup("transform:django-workdays");

    const result = transform.deserialize(["1", "2", "3", "4", "5"]);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
  });
});
