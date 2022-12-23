import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | worktime balance chart", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<WorktimeBalanceChart />`);
    assert.ok(this.element);
  });
});
