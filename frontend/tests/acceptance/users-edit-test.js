import { currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | users edit", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    this.allowed = this.server.create("user", { supervisorIds: [user.id] });
    this.notAllowed = this.server.create("user");

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });
  });

  test("can visit /users/:id", async function (assert) {
    await visit(`/users/${this.allowed.id}`);

    assert.ok(currentURL().includes(this.allowed.id));
  });

  test("shows only supervisees", async function (assert) {
    await visit(`/users/${this.notAllowed.id}`);

    assert.dom(".empty").exists();
    assert.dom(".empty").includesText("Halt");
  });

  test("allows all to superuser", async function (assert) {
    const user = this.server.create("user", { isSuperuser: true });

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    await visit(`/users/${this.notAllowed.id}`);

    assert.ok(currentURL().includes(this.notAllowed.id));
  });
});
