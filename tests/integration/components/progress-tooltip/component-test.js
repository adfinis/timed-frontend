import EmberObject from "@ember/object";
import { render, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | progress tooltip", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.create("task");
  });

  test("renders", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 50 }),
        constructor: EmberObject.create({
          modelName: "project",
        }),
      })
    );

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert.dom(".progress-tooltip").exists();

    assert
      .dom(".progress-tooltip .time-info [data-test-spent-total]")
      .hasText(/Spent \(Total\):\n\s*\d+h \d+m/);

    assert
      .dom(".progress-tooltip .time-info [data-test-spent-billable]")
      .hasText(/Spent \(Billable\):\n\s*\d+h \d+m/);

    assert
      .dom(".progress-tooltip .time-info [data-test-budget]")
      .hasText("Budget: 50h 0m");
  });

  test("renders on project with remaining effort", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 50 }),
        constructor: EmberObject.create({
          modelName: "project",
        }),
        totalRemainingEffort: moment.duration({ h: 2 }),
        remainingEffortTracking: true,
      })
    );

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert
      .dom(".progress-tooltip .time-info [data-test-remaining-effort]")
      .hasText(/Remaining effort:\n*\s*\d+h \d+m/);
  });

  test("renders with tasks", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: "task",
        }),
      })
    );

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert.dom(".progress-tooltip").exists();

    assert
      .dom(".progress-tooltip .time-info [data-test-spent-total]")
      .hasText(/Spent \(Total\):\n*\s*\d+h \d+m/);

    assert
      .dom(".progress-tooltip .time-info [data-test-spent-billable]")
      .hasText(/Spent \(Billable\):\n\s*\d+h \d+m/);

    assert
      .dom(".progress-tooltip .time-info [data-test-budget]")
      .hasText("Budget: 100h 30m");
  });

  test("renders with tasks with remaining effort", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        mostRecentRemainingEffort: moment.duration({ h: 2, m: 15 }),
        constructor: EmberObject.create({
          modelName: "task",
        }),
      })
    );

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert
      .dom(".progress-tooltip .time-info [data-test-remaining-effort]")
      .hasText(/Remaining effort:\n*\s*\d+h \d+m/);
  });

  test("toggles correctly", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: "task",
        }),
      })
    );

    this.set("visible", false);

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{this.visible}} />
    `);

    assert.dom(".progress-tooltip").doesNotExist();

    this.set("visible", true);
    // wait for trackedTask to resolve
    await settled();

    assert.dom(".progress-tooltip").exists();
  });

  test("uses danger color when the factor is more than 1", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: "project",
        }),
      })
    );

    this.server.get("/projects/:id", function ({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          "spent-time": "4 05:00:00", // 101 hours
        },
      };
    });

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert.dom(".progress-tooltip .badge--danger").exists();
    // assert.dom(".progress-tooltip .progress-bar.danger").exists();
  });

  test("uses warning color when the factor is 0.9 or more", async function (assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: "project",
        }),
      })
    );

    this.server.get("/projects/:id", function ({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          "spent-time": "3 18:00:00", // 90 hours
        },
      };
    });

    await render(hbs`
      <span id='target'></span>
      <ProgressTooltip @target='#target' @model={{this.model}} @visible={{true}} />
    `);

    assert.dom(".progress-tooltip .badge--warning").exists();
    // assert.dom(".progress-tooltip .progress-bar.warning").exists();
  });
});
