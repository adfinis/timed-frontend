import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | sy modal/footer", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`{{#sy-modal/footer}}Test{{/sy-modal/footer}}`);

    assert.dom(this.element).hasText("Test");
  });
});
