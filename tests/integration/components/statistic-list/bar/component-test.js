import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | statistic list/bar", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`{{statistic-list/bar 0.5}}`);

    const element = this.element.querySelector(".statistic-list-bar");

    assert.ok(element);

    assert.equal(
      window.getComputedStyle(element).getPropertyValue("--value").trim(),
      "0.5"
    );
  });
});
