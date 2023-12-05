import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | SyModal", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`
      <SyModalTarget />
      <SyModal @visible={{true}} as |m| >
        <m.header >
          Header
        </m.header>
        <m.body>
          Body
        </m.body>
        <m.footer>
          Footer
        </m.footer>
      </SyModal>
    `);

    assert.dom("#sy-modals > *").exists({ count: 1 });

    assert.dom("#sy-modals .modal-header").hasText("Header ×");
    assert.dom("#sy-modals .modal-body").includesText("Body");
    assert.dom("#sy-modals .modal-footer").includesText("Footer");
  });

  test("closes on click of the close icon", async function (assert) {
    this.set("visible", true);

    await render(hbs`
      <SyModalTarget />
      <SyModal @visible={{this.visible}} @onClose={{fn (mut this.visible) false}} as |m|>
        <m.header />
      </SyModal>
    `);

    assert.ok(this.visible);

    await click("#sy-modals .modal-header button");

    assert.notOk(this.visible);
  });
});
