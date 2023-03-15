import { find, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | progress bar", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`{{progress-bar 0.5}}`);

    assert.strictEqual(parseInt(find("progress").getAttribute("value")), 50);
  });
});
