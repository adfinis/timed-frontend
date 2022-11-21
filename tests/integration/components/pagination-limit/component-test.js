import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | pagination limit", function(hooks) {
  setupRenderingTest(hooks);

  test("renders", async function(assert) {
    await render(hbs`{{pagination-limit}}`);
    assert.ok(this.element);
  });

  test("can change limit", async function(assert) {
    this.set("limit", 10);

    await render(hbs`{{pagination-limit pages=5 page_size=limit}}`);

    assert.dom("span").exists({ count: 4 });
    assert.dom("a").exists({ count: 3 });

    await click("span:last-of-type a");

    assert.equal(this.limit, 100);
  });
});
