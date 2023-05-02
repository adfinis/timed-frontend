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

  test("The element should have remaining class if the remaining is defined", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{0.5}} @remaining={{0.25}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingEelement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.ok(remainingEelement);

    assert.true(remainingEelement.classList.contains("remaining"));
    assert.true(remainingEelement.classList.contains("success"));
    assert.strictEqual(
      window
        .getComputedStyle(remainingEelement)
        .getPropertyValue("--value")
        .trim(),
      "0.25"
    );
    assert.strictEqual(
      window.getComputedStyle(element).getPropertyValue("--value").trim(),
      "0.5"
    );
  });

  test("The element should not have remaining class if the remaining is not defined", async function (assert) {
    await render(hbs`<StatisticList::Bar @value={{0.5}}/>`);

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingEelement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.notOk(remainingEelement);

    assert.false(element.classList.contains("remaining"));
  });

  test("The Chart color is green when spent effort is in the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{1}} @goal={{1}} @remaining={{0}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingElement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.notOk(remainingElement);

    assert.false(element.classList.contains("strong-danger"));
    assert.true(element.classList.contains("strong-success"));
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

  test("The Chart color is red when spent effort is over the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{2}} @goal={{1}} @remaining={{0}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");

    assert.ok(element);

    assert.true(element.classList.contains("strong-danger"));
    assert.false(element.classList.contains("strong-success"));
  });

  test("The Chart color is blue & there is remaining when spent effort is in the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{0.25}} @goal={{1}} @remaining={{0.5}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingEelement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.ok(remainingEelement);

    assert.true(remainingEelement.classList.contains("success"));
    assert.false(element.classList.contains("strong-danger"));
    assert.false(element.classList.contains("strong-success"));
  });

  test("The Chart color is blue & the remaining is red when spent effort is in the budget, and the remaining is over the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{0.5}} @goal={{1}} @remaining={{1}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingEelement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.ok(remainingEelement);

    assert.false(element.classList.contains("strong-danger"));
    assert.false(element.classList.contains("strong-success"));
    assert.true(remainingEelement.classList.contains("success"));
  });

  test("The Chart color is red & the remaining is red when spent effort is over the budget, and the remaining is over the budget", async function (assert) {
    await render(
      hbs`<StatisticList::Bar @value={{1}} @goal={{0.5}} @remaining={{1}} />`
    );

    const element = this.element.querySelector(".statistic-list-bar");
    const remainingEelement = this.element.querySelector(".remaining");

    assert.ok(element);
    assert.ok(remainingEelement);

    assert.true(remainingEelement.classList.contains("danger"));
    assert.true(element.classList.contains("strong-danger"));
    assert.false(element.classList.contains("strong-success"));
  });
});
