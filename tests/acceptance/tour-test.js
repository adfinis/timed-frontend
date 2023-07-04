import {
  click,
  visit,
  currentURL,
  currentRouteName,
  settled,
} from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { setBreakpoint } from "ember-responsive/test-support";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";
import TOURS from "timed/tours";

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
    assert.dom(".shepherd-modal-is-visible").exists();
  });

  test("redirect to activities index page on tour start", async function (assert) {
    await visit("/users");

    await click("[data-test-tour-start]");

    assert.strictEqual(currentURL(), `/`);
    assert.dom(".shepherd-enabled").exists({ count: 1 });
  });

  test("steps through all available tour steps", async function (assert) {
    const sites = Object.keys(TOURS);
    const stepCount = sites.reduce((counter, site) => {
      return counter + Object.keys(TOURS[site]).length;
    }, 0);

    assert.expect(sites.length + stepCount);

    await visit("/");
    await click("[data-test-tour-start]");

    for (const site of sites) {
      assert.strictEqual(currentRouteName().replace(/\.index$/, ""), site);
      for (const step of TOURS[site]) {
        const header = Array.from(
          document.getElementsByClassName("shepherd-header")
        ).pop();
        assert.dom(header).hasText(step.title);
        Array.from(document.getElementsByClassName("shepherd-button-primary"))
          .pop()
          .click();
        // eslint-disable-next-line  no-await-in-loop
        await settled();
      }
    }
  });
});
