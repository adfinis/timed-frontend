import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sy checkmark", function (hooks) {
  setupRenderingTest(hooks);

  test("works unchecked", async function (assert) {
    await render(hbs`<SyCheckmark @checked={{false}} />`);
    assert.dom(".fa-square").exists({ count: 1 });
  });

  test("works checked", async function (assert) {
    await render(hbs`<SyCheckmark @checked={{true}} />`);
    assert.dom(".fa-square-check").exists({ count: 1 });
  });
});
