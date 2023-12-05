import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | autostart tour", function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    localStorage.removeItem("timed-tour-test");
  });

  test("exists", function (assert) {
    const service = this.owner.lookup("service:autostart-tour");
    assert.ok(service);
  });

  test("can set and get the done tours", function (assert) {
    const service = this.owner.lookup("service:autostart-tour");

    service.setProperties({ doneKey: "timed-tour-test" });

    assert.deepEqual(service.get("done"), []);

    service.set("done", ["test"]);

    assert.deepEqual(service.get("done"), ["test"]);
  });

  test("can check if all tours are done", function (assert) {
    const service = this.owner.lookup("service:autostart-tour");

    service.setProperties({ doneKey: "timed-tour-test", tours: ["test"] });

    assert.notOk(service.allDone);

    service.set("done", ["test"]);

    assert.ok(service.allDone);

    service.set("done", ["test", "test2"]);

    assert.ok(service.allDone);
  });
});
