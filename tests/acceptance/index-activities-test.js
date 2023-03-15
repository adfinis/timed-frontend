import { click, currentURL, findAll, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import moment from "moment";
import { module, skip, test } from "qunit";
import formatDuration from "timed/utils/format-duration";

module("Acceptance | index activities", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    this.activities = this.server.createList("activity", 5, {
      userId: user.id,
    });

    this.user = user;
  });

  test("can visit /", async function (assert) {
    await visit("/");

    assert.strictEqual(currentURL(), "/");
  });

  test("can list activities", async function (assert) {
    await visit("/");

    assert.dom("[data-test-activity-row]").exists({ count: 5 });
  });

  test("can start an activity", async function (assert) {
    await visit("/");

    await click('[data-test-activity-row-id="1"] [data-test-start-activity]');

    assert.dom('[data-test-activity-row-id="6"]').hasClass("primary");
  });

  test("can start an activity of a past day", async function (assert) {
    const lastDay = moment().subtract(1, "day");
    const today = moment();

    const activity = this.server.create("activity", {
      date: lastDay,
      userId: this.user.id,
      comment: "Test",
    });

    await visit(`/?day=${lastDay.format("YYYY-MM-DD")}`);

    await click(
      `[data-test-activity-row-id="${activity.id}"] [data-test-start-activity]`
    );

    assert.strictEqual(currentURL(), `/?day=${today.format("YYYY-MM-DD")}`);

    assert
      .dom(findAll('[data-test-activity-row-id="7"] td')[2])
      .hasText(activity.comment);
  });

  test("can stop an activity", async function (assert) {
    await visit("/");

    await click('[data-test-activity-row-id="1"] [data-test-start-activity]');

    assert.dom('[data-test-activity-row-id="6"]').hasClass("primary");

    await click('[data-test-activity-row-id="6"] [data-test-stop-activity]');

    assert.dom('[data-test-activity-row-id="6"]').doesNotHaveClass("primary");
  });

  test("can generate reports", async function (assert) {
    const activity = this.server.create("activity", {
      userId: this.user.id,
      review: true,
      notBillable: true,
    });
    const { id } = activity;

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.strictEqual(currentURL(), "/reports");

    assert.dom("[data-test-report-row]").exists({ count: 7 });

    assert
      .dom(
        `[data-test-report-row-id="${id}"] .form-group:first-child .ember-power-select-selected-item`
      )
      .hasText(activity.task.project.customer.name);
    assert
      .dom(
        `[data-test-report-row-id="${id}"] .form-group:nth-child(2) .ember-power-select-selected-item`
      )
      .hasText(activity.task.project.name);
    assert
      .dom(
        `[data-test-report-row-id="${id}"] .form-group:nth-child(3) .ember-power-select-selected-item`
      )
      .hasText(activity.task.name);

    await visit("/");

    assert.dom('[data-test-activity-row-id="1"]').hasClass("transferred");
  });

  test("can not generate reports twice", async function (assert) {
    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.strictEqual(currentURL(), "/reports");

    assert.dom("[data-test-report-row]").exists({ count: 6 });

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.strictEqual(currentURL(), "/reports");

    assert.dom("[data-test-report-row]").exists({ count: 6 });
  });

  test("shows a warning when generating reports from unknown tasks", async function (assert) {
    this.server.create("activity", "unknown", { userId: this.user.id });

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-unknown-warning] button.btn-default");

    assert.strictEqual(currentURL(), "/");

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-unknown-warning] button.btn-primary");

    assert.strictEqual(currentURL(), "/reports");
  });

  test("shows a warning when generating reports from day overlapping activities", async function (assert) {
    const date = moment().subtract(1, "days");

    this.server.create("activity", "active", { userId: this.user.id, date });

    await visit(`/?day=${date.format("YYYY-MM-DD")}`);

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-overlapping-warning] button.btn-default");

    assert.notOk(currentURL().includes("reports"));

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-overlapping-warning] button.btn-primary");

    assert.ok(currentURL().includes("reports"));
  });

  test("can handle both warnings", async function (assert) {
    const date = moment().subtract(1, "days");

    this.server.create("activity", "unknown", { userId: this.user.id, date });
    this.server.create("activity", "active", { userId: this.user.id, date });

    await visit(`/?day=${date.format("YYYY-MM-DD")}`);

    // both close if one clicks cancel
    await click("[data-test-activity-generate-timesheet]");
    assert.dom(".modal--visible").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-default");
    assert.dom(".modal--visible").exists({ count: 0 });
    assert.notOk(currentURL().includes("reports"));

    // both must be fine if test should continue
    await click("[data-test-activity-generate-timesheet]");
    assert.dom(".modal--visible").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-primary");
    assert.dom(".modal--visible").exists({ count: 1 });
    await click("[data-test-unknown-warning] button.btn-default");
    assert.dom(".modal--visible").exists({ count: 0 });

    await click("[data-test-activity-generate-timesheet]");
    assert.dom(".modal--visible").exists({ count: 2 });
    await click("[data-test-unknown-warning] button.btn-primary");
    assert.dom(".modal--visible").exists({ count: 1 });
    await click("[data-test-overlapping-warning] button.btn-default");
    assert.dom(".modal--visible").exists({ count: 0 });
    assert.notOk(currentURL().includes("reports"));

    // if both are fine continue
    await click("[data-test-activity-generate-timesheet]");
    assert.dom(".modal--visible").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-primary");
    assert.dom(".modal--visible").exists({ count: 1 });
    await click("[data-test-unknown-warning] button.btn-primary");
    assert.dom(".modal--visible").exists({ count: 0 });
    assert.ok(currentURL().includes("reports"));
  });

  test("splits 1 day overlapping activities when stopping", async function (assert) {
    const activity = this.server.create("activity", "active", {
      userId: this.user.id,
      date: moment().subtract(1, "days"),
    });

    const nextActivityId = Number(activity.id) + 1;

    await visit("/");

    await click("[data-test-record-stop]");

    // today block should be from 00:00 to now
    assert.dom(`[data-test-activity-row-id="${nextActivityId}"]`).exists();

    await click(`[data-test-activity-row-id="${nextActivityId}"]`);

    assert
      .dom("[data-test-activity-block-row] td:first-child input")
      .hasValue("00:00");

    // yesterday block should be from old start time to 23:59
    await visit("/");
    await click("[data-test-previous]");

    assert.dom(`[data-test-activity-row-id="${activity.id}"]`).exists();

    await click(`[data-test-activity-row-id="${activity.id}"]`);

    assert
      .dom("[data-test-activity-block-row] td:nth-child(3) input")
      .hasValue("23:59");
  });

  test("doesn't split >1 days overlapping activities when stopping", async function (assert) {
    const activity = this.server.create("activity", "active", {
      userId: this.user.id,
      date: moment().subtract(2, "days"),
    });

    await visit("/");

    await click("[data-test-record-stop]");

    // today block should not exist
    assert
      .dom(`[data-test-activity-row-id="${+activity.id + 1}"]`)
      .doesNotExist();

    // yesterday block should not exist
    await visit("/");
    await click("[data-test-previous]");

    assert
      .dom(`[data-test-activity-row-id="${+activity.id + 1}"]`)
      .doesNotExist();

    // day before yesterday block should be from old start time to 23:59
    await visit("/");
    await click("[data-test-previous]");
    await click("[data-test-previous]");

    assert
      .dom(`[data-test-activity-row-id="${activity.id}"]`)
      .exists({ count: 1 });
    await click(`[data-test-activity-row-id="${activity.id}"]`);
    assert
      .dom("[data-test-activity-block-row] td:nth-child(3) input")
      .hasValue("23:59");
  });

  skip("can generate active reports which do not overlap", async function (assert) {
    const activity = await this.server.create("activity", "active", {
      userId: this.user.id,
    });
    const { id } = activity;
    let { duration } = activity;

    duration = moment
      .duration(duration, "HH:mm:ss")
      .add(moment().diff(moment(activity.fromTime, "HH:mm:ss")));

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.equal(currentURL(), "/reports");

    assert.dom("[data-test-report-row]").exists({ count: 7 });

    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [name=duration-day]`)
      .hasValue(formatDuration(duration, false));
    //TODO: The expected ID of the generated activity is incorrect and leads to this test failing.
    // The created activity should have the ID: "6" or "7" but it will internally get the ID "1"
    // assigned for no obvious reason. For degugging check out the extracted id in this test and compair
    // it to the local store id.
  });

  test("combines identical activities when generating", async function (assert) {
    const task = this.server.create("task");
    const activities = this.server.createList("activity", 3, "defineTask", {
      userId: this.user.id,
      comment: "Test",
      review: false,
      notBillable: false,
      definedTask: task.id,
    });

    const duration = activities.reduce((acc, val) => {
      return acc.add(val.duration);
    }, moment.duration());

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.strictEqual(currentURL(), "/reports");

    assert.dom("[data-test-report-row]").exists({ count: 7 });

    assert
      .dom(`[data-test-report-row-id="6"] [name=duration-day]`)
      .hasValue(formatDuration(duration, false));
  });
});
