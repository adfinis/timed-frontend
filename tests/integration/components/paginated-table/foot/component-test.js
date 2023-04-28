import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | paginated table/foot", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<PaginatedTable::Foot />`);
    assert.ok(this.element);
  });
});
