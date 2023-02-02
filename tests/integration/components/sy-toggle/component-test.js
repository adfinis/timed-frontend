import { click, render, triggerKeyEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sy-toggle", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set("noop", () => {});
  });

  test("it renders", async function (assert) {
    await render(hbs`<SyToggle @icon="eye" @onToggle={{this.noop}} />`);

    assert.dom(this.element).hasText("");
    assert.dom(".sy-toggle .fa-eye").exists();

    // Template block usage:
    await render(hbs`
      <SyToggle @onToggle={{this.noop}}>
        template block text
      </SyToggle>
    `);

    assert.dom(this.element).hasText("template block text");
    assert.dom(".sy-toggle .fa-eye").doesNotExist();
  });

  test("it toggles", async function (assert) {
    this.set("value", true);

    await render(
      hbs`<SyToggle @icon="eye" @value={{this.value}} @onToggle={{toggle "value" this}}/>`
    );

    assert.dom(".sy-toggle").hasClass("active");

    await click(".sy-toggle");

    assert.dom(".sy-toggle").hasClass("inactive");

    await triggerKeyEvent(".sy-toggle", "keyup", 32);

    assert.dom(".sy-toggle").hasClass("active");
  });

  test("it includes the hint", async function (assert) {
    this.set("disabled", false);
    await render(
      hbs`<SyToggle @icon="eye" @hint="test" @disabled={{this.disabled}} @onToggle={{this.noop}} />`
    );

    assert.dom(".sy-toggle").hasAttribute("title", "test");

    this.set("disabled", true);

    assert.dom(".sy-toggle").hasAttribute("title", "test (disabled)");
  });
});
