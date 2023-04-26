import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | statistic list/bar", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<StatisticList::Bar @value={{0.5}} />`);

    const element = this.element.querySelector(".statistic-list-bar");

    assert.ok(element);

    assert.strictEqual(
      window.getComputedStyle(element).getPropertyValue("--value").trim(),
      "0.5"
    );
  });

  test("The Chart color is RED when spent effort is over the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{0.5}} @goal={{0.4}} @remaining={{0}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");

    assert.ok(element);

    assert.true(element.classList.contains("strong-danger"));
    assert.false(element.classList.contains("strong-success"));
  });

  test("The Chart color is GREEN when spent effort is in the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{0.5}} @goal={{0.6}} @remaining={{0}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");

    assert.ok(element);

    assert.false(element.classList.contains("strong-danger"));
    assert.true(element.classList.contains("strong-success"));
  });
});
