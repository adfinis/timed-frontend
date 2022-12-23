import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Model | user", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    this.set("store", this.owner.lookup("service:store"));
  });

  test("exists", function (assert) {
    const model = this.store.createRecord("user");

    assert.ok(model);
  });

  test("computes a full name", function (assert) {
    const model = this.store.createRecord("user", {
      firstName: "Hans",
      lastName: "Muster",
    });

    assert.ok(model);

    assert.equal(model.get("fullName"), "Hans Muster");
  });

  test("computes a long name with full name", function (assert) {
    const model = this.store.createRecord("user", {
      username: "hansm",
      firstName: "Hans",
      lastName: "Muster",
    });

    assert.ok(model);

    assert.equal(model.get("longName"), "Hans Muster (hansm)");
  });

  test("computes a long name without full name", function (assert) {
    const model = this.store.createRecord("user", { username: "hansm" });

    assert.ok(model);

    assert.equal(model.get("longName"), "hansm");
  });

  test("computes the active employment", function (assert) {
    const model = this.store.createRecord("user", { username: "hansm" });

    assert.ok(model);

    assert.notOk(model.get("activeEmployment"));

    model.set("employments", [
      this.store.createRecord("employment", { id: 1, to: null }),
      this.store.createRecord("employment", { id: 2, to: moment() }),
    ]);

    assert.equal(Number(model.get("activeEmployment.id")), 1);
  });
});
