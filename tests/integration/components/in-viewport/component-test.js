import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | in viewport", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`
      <div class="parent" style="heigth: 20px; overflow: scroll;">
        <div class="child" style="heigth: 2000px;">
          {{#in-viewport}}test{{/in-viewport}}
        </div>
      </div>
    `);

    assert.dom(".child").includesText("test");
  });
});
