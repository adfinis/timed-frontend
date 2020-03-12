import EmberObject from "@ember/object";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | projects", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const route = this.owner.lookup("route:projects");
    assert.ok(route);
  });

  test("can execute hook", function(assert) {
    const route = this.owner.lookup("route:projects");
    route.set("user", { isSuperuser: false });

    route.setupController(EmberObject.create());

    assert.ok(route);
  });
});
