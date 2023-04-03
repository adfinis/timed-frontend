import { visit, currentURL, click } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | users edit responsibilities", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create("user", {
      isSuperuser: true,
      firstName: "Admin FirstName",
      lastName: "Admin LastName",
    });
    this.secondUser = this.server.create("user", {
      supervisorIds: [this.user.id],
      firstName: "FirstName",
      lastName: "LastName",
    });

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id });
  });

  test("can visit /users/:id/responsibilities", async function (assert) {
    await visit(`/users/1/responsibilities`);

    assert.dom(".card").exists({ count: 2 });
  });

  test("Super user can visit the users profile", async function (assert) {
    await visit(`/users/1/responsibilities`);
    await click("tbody tr:nth-child(2)");
    assert.strictEqual(currentURL(), `/users/${this.secondUser.id}`);
  });
});
