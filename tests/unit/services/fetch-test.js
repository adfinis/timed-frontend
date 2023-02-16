import { setupTest } from "ember-qunit";
import { module, test } from "qunit";
import setupSession from "timed/tests/helpers/session-mock";

module("Unit | Service | fetch", function (hooks) {
  setupTest(hooks);
  setupSession(hooks);

  test("exists", function (assert) {
    const service = this.owner.lookup("service:fetch");
    assert.ok(service);
  });

  test("adds the auth token to the headers", function (assert) {
    const service = this.owner.lookup("service:fetch");
    const session = this.owner.lookup("service:session");

    assert.equal(
      service.get("headers.authorization"),
      session.headers.authorization
    );
  });

  test("does not add the auth token to the headers if no token is given", function (assert) {
    const service = this.owner.lookup("service:fetch");
    const session = this.owner.lookup("service:session");

    delete session.headers.authorization;

    assert.notOk(service.get("headers.authorization"));
  });
});
