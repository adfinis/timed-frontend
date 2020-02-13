import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | filter sidebar/label", function(hooks) {
  setupRenderingTest(hooks);

  test("renders", async function(assert) {
    await render(hbs`
      {{#filter-sidebar/label}}
        Some label
      {{/filter-sidebar/label}}
    `);

    assert.dom("label").exists();
    assert.dom("label").hasText("Some label");
  });
});
