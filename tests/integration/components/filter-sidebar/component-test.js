import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import wait from "ember-test-helpers/wait";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | filter sidebar", function (hooks) {
  setupRenderingTest(hooks);

  test("can reset", async function (assert) {
    assert.expect(1);
    this.set("didReset", false);

    await render(hbs`
      <div id="filter-sidebar-target"></div>
      {{filter-sidebar on-reset=(action (mut didReset) true)}}
    `);

    return wait().then(async () => {
      await click(".filter-sidebar-reset");

      assert.ok(this.get("didReset"));
    });
  });

  test("shows applied filter count", async function (assert) {
    this.set("count", 0);

    await render(hbs`
      <div id="filter-sidebar-target"></div>
      {{filter-sidebar appliedCount=count}}
    `);

    return wait().then(() => {
      assert.dom(".filter-sidebar-title").includesText("Filters");

      this.set("count", 1);

      assert.dom(".filter-sidebar-title").includesText("1 Filter applied");

      this.set("count", 5);

      assert.dom(".filter-sidebar-title").includesText("5 Filters applied");
    });
  });
});
