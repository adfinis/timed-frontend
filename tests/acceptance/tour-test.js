import { click, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { setBreakpoint } from "ember-responsive/test-support";
import { authenticateSession } from "ember-simple-auth/test-support";
import { waitForStep } from "ember-site-tour/test-support/helpers";
import { module, test } from "qunit";

module("Acceptance | tour", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { tourDone: false });

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    localStorage.removeItem("timed-tour");

    setBreakpoint("xl");
  });

  test("shows a welcome dialog", async function (assert) {
    await visit("/");

    await waitForStep();

    assert.dom(".modal--visible").exists();
  });

  test("does not show a welcome dialog when tour completed", async function (assert) {
    const user = this.server.create("user", { tourDone: true });

    this.server.get("users/me", function () {
      return user;
    });

    // eslint-disable-next-line camelcase
    await authenticateSession();

    await visit("/");

    assert.dom(".modal--visible").doesNotExist();
  });

  test("does not show a welcome dialog when later clicked", async function (assert) {
    await visit("/");

    assert.dom(".modal--visible").exists();

    await click("[data-test-tour-later]");

    await visit("/someotherroute");
    await visit("/");

    assert.dom(".modal--visible").doesNotExist();
  });

  test("can ignore tour permanently", async function (assert) {
    await visit("/");

    await click("[data-test-tour-never]");

    await visit("/someotherroute");
    await visit("/");

    assert.dom(".modal--visible").doesNotExist();
  });

  test("can start tour", async function (assert) {
    await visit("/");

    await click("[data-test-tour-start]");

    assert.dom(".modal--visible").doesNotExist();
  });
});
