import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
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

    await click(".filter-sidebar-reset");

    assert.ok(this.didReset);
  });

  test("shows applied filter count", async function (assert) {
    this.set("count", 0);

    await render(hbs`
      <div id="filter-sidebar-target"></div>
      {{filter-sidebar appliedCount=count}}
    `);

    assert.dom(".filter-sidebar-title").includesText("Filters");

    this.set("count", 1);

    assert.dom(".filter-sidebar-title").includesText("1 Filter applied");

    this.set("count", 5);

    assert.dom(".filter-sidebar-title").includesText("5 Filters applied");
  });
});
