import { A } from "@ember/array";
import ArrayProxy from "@ember/array/proxy";
import { render, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | statistic list", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set("noop", () => {});
  });

  test("renders", async function (assert) {
    await render(hbs`<StatisticList />`);

    assert.dom("div").exists();
  });

  test("shows an error message", async function (assert) {
    this.set("data", { last: { isError: true } });

    await render(hbs`<StatisticList
      @data={{this.data}}
      @type='year'
      @ordering='year'
      @onOrderingChange={{this.noop}}
    />`);

    assert.dom(".empty").includesText("Oops");
  });

  test("shows an empty message", async function (assert) {
    this.set("data", { last: { value: [] } });

    await render(hbs`<StatisticList
      @data={{this.data}}
      @type='year'
      @ordering='year'
      @onOrderingChange={{this.noop}}
    />`);

    assert.dom(".empty").includesText("No statistics to display");
  });

  test("shows a loading icon", async function (assert) {
    this.set("data", { isRunning: true });

    await render(hbs`<StatisticList
      @data={{this.data}}
      @type='year'
      @ordering='year'
      @onOrderingChange={{this.noop}}
    />`);

    assert.dom(".loading-icon").exists();
  });

  test("shows a missing parameters message", async function (assert) {
    this.set("data", { last: { value: [] } });
    this.set("missingParams", ["foo", "bar"]);

    await render(hbs`<StatisticList
      @data={{this.data}}
      @type='year'
      @ordering='year'
      @onOrderingChange={{this.noop}}
      @missingParams={{this.missingParams}}
    />`);

    assert.dom(".empty").includesText("Foo and bar are required parameters");
  });

  test("renders contents and parses total time", async function (assert) {
    this.set("data", {
      last: {
        value: ArrayProxy.create({
          content: A([
            { duration: moment.duration({ h: 3 }) },
            { duration: moment.duration({ h: 6 }) },
          ]),
          meta: {
            "total-time": "1 10:30:00",
          },
        }),
      },
    });

    await render(hbs`
      <div class="page-content--scroll">
        <StatisticList
          @data={{this.data}}
          @type='year'
          @ordering='year'
          @onOrderingChange={{this.noop}}
        />
      </div>
    `);

    await waitFor("table tbody tr");

    assert.dom("[data-test-statistic-list-column]").exists({ count: 4 });
    assert.dom("[data-test-statistic-list-row]").exists({ count: 2 });
    assert.dom(".total").hasText("34h 30m");
  });
});
