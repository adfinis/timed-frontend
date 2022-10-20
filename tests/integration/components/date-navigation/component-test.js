import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

const DATE = moment({ y: 2017, m: 2, d: 10 });

module("Integration | Component | date navigation", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`
    );

    assert.equal(this.date.format("YYYY-MM-DD"), "2017-01-10");
  });

  test("can select the next day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`
    );

    await click("[data-test-next]");

    assert.equal(this.date.format("YYYY-MM-DD"), "2017-01-11");
  });

  test("can select the previous day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`
    );

    await click("[data-test-previous]");

    assert.equal(this.date.format("YYYY-MM-DD"), "2017-01-09");
  });

  test("can select the current day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`
    );

    await click("[data-test-today]");

    assert.equal(this.date.format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"));
  });
});
