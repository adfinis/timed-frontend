import { hbs } from 'ember-cli-htmlbars';
import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | welcome modal", function(hooks) {
  setupRenderingTest(hooks);

  test("renders", async function(assert) {
    await render(hbs`{{sy-modal-target}}{{welcome-modal visible=true}}`);
    assert.ok(this.element);
  });
});
