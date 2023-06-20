import { click, visit, currentURL, currentRouteName, settled } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { setBreakpoint } from "ember-responsive/test-support";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";
import moment from "moment";
import TOURS from "timed/tours";

module("Acceptance | tour", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  let shepherd;

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { tourDone: false });
    shepherd = this.owner.lookup('service:shepherd');

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    localStorage.removeItem("timed-tour");

    setBreakpoint("xl");
  });

  hooks.afterEach(async function () {
    if (await shepherd.tour.isActive) {
      return await shepherd.tour.hide();
    }
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
  });

  test("The Tour will show after clicking Sure button", async function (assert) {
    await visit("/");
    await click("[data-test-tour-start]");
    assert.dom('.shepherd-modal-is-visible', document.body).exists();
  });

  test("The Tour will start from the index page even if we are in another page", async function (assert) {
    await visit("/users");
    await click("[data-test-tour-start]");
    assert.strictEqual(currentURL(), `/?day=${moment(moment()).format("YYYY-MM-DD")}`)
    assert.dom(".shepherd-enabled").exists({ count: 1 });
  });

  test("The Tours of index page", async function (assert) {
    await visit("/");
    await click("[data-test-tour-start]");
    const indexActivitiesPageTours = TOURS['index.activities.index'];
    assert.strictEqual(currentRouteName(), 'index.activities.index', 'The current route name is equal to tour route name');
    assert.dom(".shepherd-enabled", document.body).exists();
    assert.dom(".shepherd-button-primary", document.body).exists();
    assert.dom(`[data-shepherd-step-id='${indexActivitiesPageTours[0].id}']`, document.body).exists();
    await click(document.querySelector(".shepherd-button-primary"));
    assert.dom(".shepherd-button-primary", document.body).exists();
    assert.dom(`[data-shepherd-step-id='${indexActivitiesPageTours[1].id}']`, document.body).exists();
    await click(document.querySelector(".shepherd-button-primary"));
    assert.dom(".shepherd-button-primary", document.body).exists();
    assert.dom(`[data-shepherd-step-id='${indexActivitiesPageTours[2].id}']`, document.body).exists();
    await click(document.querySelector(".shepherd-button-primary"));
  });

  test("The Tours of attendances page", async function (assert) {
    await visit("/");
    await click("[data-test-tour-start]");
    await click(document.querySelector(".shepherd-button-secondary"));
    await visit("/attendances")
    const indexAttendancesPageTours = TOURS['index.attendances'];
    assert.strictEqual(currentRouteName(), 'index.attendances', 'The current route name is equal to tour route name');
    assert.dom(".shepherd-enabled", document.body).exists();
    assert.dom(`[data-shepherd-step-id='${indexAttendancesPageTours[0].id}']`).exists();
    assert.dom(".shepherd-button-primary", document.body).exists();
    await click(document.querySelector(".shepherd-button-primary"));
    // assert.dom(`[data-shepherd-step-id='${indexAttendancesPageTours[1].id}']`, document.body).exists();
    // await click(document.querySelector(".shepherd-button-primary"));
  });

  // test("The Tours of reports page", async function (assert) {
  //   await visit("/");
  //   await click("[data-test-tour-start]");
  //   const indexReportsPageTours = TOURS['index.reports'];
  //   await visit("/reports");
  //   assert.strictEqual(currentRouteName(), 'index.reports', 'The current route name is equal to tour route name');
  //   assert.dom(".shepherd-enabled", document.body).exists();
  //   assert.dom(".shepherd-button-primary", document.body).exists();
  //   assert.dom(`[data-shepherd-step-id='${indexReportsPageTours[0].target}-${indexReportsPageTours[0].title}']`, document.body).exists();
  //   await click(document.querySelector(".shepherd-button-primary"));
  //   assert.dom(".shepherd-button-primary", document.body).exists();
  //   assert.dom(`[data-shepherd-step-id='${indexReportsPageTours[1].target}-${indexReportsPageTours[1].title}']`, document.body).exists();
  //   await click(document.querySelector(".shepherd-button-primary"));
  //   assert.dom(".shepherd-button-primary", document.body).exists();
  //   assert.dom(`[data-shepherd-step-id='${indexReportsPageTours[2].target}-${indexReportsPageTours[2].title}']`, document.body).exists();
  //   await click(document.querySelector(".shepherd-button-primary"));
  //   assert.dom(".shepherd-button-primary", document.body).exists();
  //   assert.dom(`[data-shepherd-step-id='${indexReportsPageTours[3].target}-${indexReportsPageTours[3].title}']`, document.body).exists();
  //   await click(document.querySelector(".shepherd-button-primary"));
  //   assert.dom(".shepherd-button-primary", document.body).exists();
  //   assert.dom(`[data-shepherd-step-id='${indexReportsPageTours[4].target}-${indexReportsPageTours[4].title}']`, document.body).exists();
  //   await click(document.querySelector(".shepherd-button-primary"));
  // });
});
