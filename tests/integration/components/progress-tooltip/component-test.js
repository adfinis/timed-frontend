import EmberObject from "@ember/object";
import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, skip, test } from "qunit";
import { startMirage } from "timed/initializers/ember-cli-mirage";

module("Integration | Component | progress tooltip", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();

    this.server.create("task");
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test("renders", async function(assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 50 }),
        constructor: EmberObject.create({
          modelName: "project"
        })
      })
    );

    await render(hbs`
      <span id='target'></span>
      {{progress-tooltip target='#target' model=model visible=true}}
    `);

    assert.dom(".progress-tooltip").exists();

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(1)")
      .hasText(/^Spent \(Total\): \d+h \d+m$/);

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(2)")
      .hasText(/^Spent \(Billable\): \d+h \d+m$/);

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(3)")
      .hasText("Budget: 50h 0m");
  });

  test("renders with tasks", async function(assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: "task"
        })
      })
    );

    await render(hbs`
      <span id='target'></span>
      {{progress-tooltip target='#target' model=model visible=true}}
    `);

    assert.dom(".progress-tooltip").exists();

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(1)")
      .hasText(/^Spent \(Total\): \d+h \d+m$/);

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(2)")
      .hasText(/^Spent \(Billable\): \d+h \d+m$/);

    assert
      .dom(".progress-tooltip .time-info .time-info-durations p:nth-child(3)")
      .hasText("Budget: 100h 30m");
  });

  test("toggles correctly", async function(assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: "task"
        })
      })
    );

    this.set("visible", false);

    await render(hbs`
      <span id='target'></span>
      {{progress-tooltip target='#target' model=model visible=visible}}
    `);

    assert.dom(".progress-tooltip").doesNotExist();

    this.set("visible", true);

    assert.dom(".progress-tooltip").exists();
  });

  // TODO enable this
  skip("uses danger color when the factor is more than 1", async function(assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: "project"
        })
      })
    );

    this.server.get("/projects/:id", function({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          "spent-time": "4 05:00:00" // 101 hours
        }
      };
    });

    await render(hbs`
      <span id='target'></span>
      {{progress-tooltip target='#target' model=model visible=true}}
    `);

    assert.dom(".progress-tooltip .badge--danger").exists();
    assert.dom(".progress-tooltip .progress-bar.danger").exists();
  });

  // TODO enable this
  skip("uses warning color when the factor is 0.9 or more", async function(assert) {
    this.set(
      "model",
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: "project"
        })
      })
    );

    this.server.get("/projects/:id", function({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          "spent-time": "3 18:00:00" // 90 hours
        }
      };
    });

    await render(hbs`
      <span id='target'></span>
      {{progress-tooltip target='#target' model=model visible=true}}
    `);

    assert.dom(".progress-tooltip .badge--warning").exists();
    assert.dom(".progress-tooltip .progress-bar.warning").exists();
  });
});
