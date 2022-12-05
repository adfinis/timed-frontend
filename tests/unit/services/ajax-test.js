import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | ajax", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const service = this.owner.lookup("service:ajax");
    assert.ok(service);
  });

  test("adds the auth token to the headers", function (assert) {
    const service = this.owner.lookup("service:ajax");

    service
      .get("session")
      .set("data", { authenticated: { access_token: "test" } });

    assert.equal(service.get("headers.Authorization"), "Bearer test");
  });

  test("does not add the auth token to the headers if no token is given", function (assert) {
    const service = this.owner.lookup("service:ajax");

    service
      .get("session")
      .set("data", { authenticated: { access_token: null } });

    assert.notOk(service.get("headers.Authorization"));
  });
});
