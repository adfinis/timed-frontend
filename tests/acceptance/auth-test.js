import { click, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | auth", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const user = this.server.create("user", {
      firstName: "John",
      lastName: "Doe",
      password: "123qwe",
    });

    this.user = user;

    this.server.get("users/me", function () {
      return user;
    });
  });

  test("can authenticate", async function (assert) {
    await authenticateSession();

    await visit("/");
    assert.strictEqual(currentURL(), "/");
  });

  test("can logout", async function (assert) {
    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id });

    await visit("/");

    assert.strictEqual(currentURL(), "/");

    await click("[data-test-logout]");

    assert.strictEqual(currentURL(), "/login");
  });
});
