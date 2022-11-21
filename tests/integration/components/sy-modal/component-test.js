import { hbs } from 'ember-cli-htmlbars';
import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sy modal", function(hooks) {
  setupRenderingTest(hooks);

  test("renders", async function(assert) {
    await render(hbs`
      {{sy-modal-target}}
      {{#sy-modal visible=true as |m|}}
        {{#m.header}}
          Header
        {{/m.header}}
        {{#m.body}}
          Body
        {{/m.body}}
        {{#m.footer}}
          Footer
        {{/m.footer}}
      {{/sy-modal}}
    `);

    assert.dom("#sy-modals > *").exists({ count: 1 });

    assert.dom("#sy-modals .modal-header").hasText("Header ×");
    assert.dom("#sy-modals .modal-body").includesText("Body");
    assert.dom("#sy-modals .modal-footer").includesText("Footer");
  });

  test("closes on click of the close icon", async function(assert) {
    this.set("visible", true);

    await render(hbs`
      {{sy-modal-target}}
      {{#sy-modal visible=visible as |m|}}
        {{m.header}}
      {{/sy-modal}}
    `);

    assert.ok(this.visible);

    await click("#sy-modals .modal-header button");

    assert.notOk(this.visible);
  });
});
