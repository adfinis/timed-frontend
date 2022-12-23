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
});
