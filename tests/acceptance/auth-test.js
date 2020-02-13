import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | auth", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.user = this.server.create("user", {
      firstName: "John",
      lastName: "Doe",
      password: "123qwe"
    });
  });

  test("prevents unauthenticated access", async function(assert) {
    await visit("/");
    assert.equal(currentURL(), "/login");
  });

  test("can login", async function(assert) {
    await visit("/login");

    await fillIn("input[type=text]", "johnd");
    await fillIn("input[type=password]", "123qwe");

    await click("button[type=submit]");

    assert.equal(currentURL(), "/");
  });

  test("validates login", async function(assert) {
    await visit("/login");

    await fillIn("input[type=text]", "johnd");
    await fillIn("input[type=password]", "123123");

    await click("button[type=submit]");

    assert.equal(currentURL(), "/login");

    await fillIn("input[type=text]", "");
    await fillIn("input[type=password]", "");

    await click("button[type=submit]");

    assert.equal(currentURL(), "/login");
  });

  test("can logout", async function(assert) {
    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id });

    await visit("/");

    assert.equal(currentURL(), "/");

    await click("[data-test-logout]");

    assert.equal(currentURL(), "/login");
  });
});
