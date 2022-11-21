import { click, find, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Component | sy checkbox", function(hooks) {
  setupRenderingTest(hooks);

  test("works", async function(assert) {
    await render(hbs`{{sy-checkbox label='Test Label'}}`);

    assert.dom("label").hasText("Test Label");
  });

  test("works in block style", async function(assert) {
    await render(hbs`{{#sy-checkbox}}Test Label{{/sy-checkbox}}`);

    assert.dom("label").hasText("Test Label");
  });

  test("changes state", async function(assert) {
    this.set("checked", false);

    await render(
      hbs`{{sy-checkbox checked=checked on-change=(action (mut checked))}}`
    );

    assert.dom("input").isNotChecked();
    assert.notOk(this.checked);

    await click("label");

    assert.dom("input").isChecked();
    assert.ok(this.checked);

    await click("label");

    assert.dom("input").isNotChecked();
    assert.notOk(this.checked);
  });

  test("can be indeterminate", async function(assert) {
    this.set("checked", null);

    await render(
      hbs`{{sy-checkbox checked=checked on-change=(action (mut checked))}}`
    );

    assert.ok(find("input").indeterminate);
    assert.equal(this.checked, null);

    await click("label");

    // clicking on an indeterminate checkbox makes test checked
    assert.dom("input").isChecked();
    assert.ok(this.checked);
  });
});
