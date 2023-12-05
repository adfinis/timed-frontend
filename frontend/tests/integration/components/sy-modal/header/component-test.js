import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | SyModal::Header", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("visible", true);

    await render(hbs`
      <SyModal::Header
        @close={{(fn (mut this.visible) false)}}
      >
        Test
      </SyModal::Header>
    `);

    assert.dom(this.element).hasText("Test ×");
  });

  test("closes on click of the close icon", async function (assert) {
    this.set("visible", true);

    await render(hbs`
      <SyModal::Header
        @close={{(fn (mut this.visible) false)}}
      >
        Test
      </SyModal::Header>
    `);

    assert.ok(this.visible);

    await click("button");

    assert.notOk(this.visible);
  });
});
