import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sort header", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<SortHeader @current='-test' @by='foo' />`);
    assert.dom(".fa-sort").exists({ count: 1 });
  });

  test("renders active state", async function (assert) {
    this.set("current", "-test");
    this.set("update", (sort) => {
      this.set("current", sort);
    });

    await render(
      hbs`<SortHeader @current={{this.current}} @by='test' @update={{this.update}} />`
    );
    assert.dom(".fa-sort-desc").exists({ count: 1 });

    await click("i");
    assert.dom(".fa-sort-asc").exists({ count: 1 });
  });
});
