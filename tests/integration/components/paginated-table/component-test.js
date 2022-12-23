import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | paginated table", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`{{paginated-table}}`);
    assert.ok(this.element);
  });
});
