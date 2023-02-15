import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | SyModal::Footer", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<SyModal::Footer>Test</SyModal::Footer>`);

    assert.dom(this.element).hasText("Test");
  });
});
