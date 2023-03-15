import { click, fillIn, currentURL, visit, waitFor } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { selectSearch } from "ember-power-select/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

import userSelect from "../helpers/user-select";

module("Acceptance | users", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    this.server.createList("user", 5, { supervisorIds: [user.id] });
    this.server.createList("user", 5);

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });
  });

  test("shows only supervisees", async function (assert) {
    await visit("/users");

    await waitFor("table tbody tr");

    assert.dom("table tbody tr").exists({ count: 5 });
  });

  test("shows all to superuser", async function (assert) {
    const user = this.server.create("user", { isSuperuser: true });

    this.server.get("users/me", function () {
      return user;
    });

    // eslint-disable-next-line camelcase
    await authenticateSession();

    await visit("/users");

    await waitFor("table tbody tr");

    assert.dom("table tbody tr").exists({ count: 12 });
  });

  test("can filter and reset", async function (assert) {
    const user = this.server.create("user", { isSuperuser: true });

    this.server.get("users/me", function () {
      return user;
    });

    // eslint-disable-next-line camelcase
    await authenticateSession();

    await visit("/users");

    await click("[data-test-filter-active] button:nth-child(1)");
    await fillIn("[data-test-filter-search] input", "foobar");
    await selectSearch("[data-test-filter-user] .user-select", user.username);
    await userSelect();

    assert.ok(currentURL().includes("search=foobar"));
    assert.ok(currentURL().includes("active="));
    assert.ok(currentURL().includes("supervisor=12"));

    await click(".filter-sidebar-reset");

    assert.strictEqual(currentURL(), "/users");
  });
});
