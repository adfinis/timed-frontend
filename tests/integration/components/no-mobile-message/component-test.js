import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | no mobile message", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(hbs`<NoMobileMessage />`);
    assert.ok(this.element);
  });
});
