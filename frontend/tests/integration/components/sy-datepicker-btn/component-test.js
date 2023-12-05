import { find, render } from "@ember/test-helpers";
import { clickTrigger } from "ember-basic-dropdown/test-support/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | sy datepicker btn", function (hooks) {
  setupRenderingTest(hooks);

  test("toggles the calendar on click of the button", async function (assert) {
    this.set("value", moment());

    await render(
      hbs`<SyDatepickerBtn @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    assert.dom(".sy-datepicker").doesNotExist();

    await clickTrigger();

    assert.dom(".sy-datepicker").exists();
  });

  test("changes value on selection", async function (assert) {
    this.set("value", moment());

    await render(
      hbs`<SyDatepickerBtn @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    await clickTrigger();

    const target = find(
      ".ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child"
    );

    target.click();

    const expected = moment().endOf("month").endOf("week");

    assert.ok(this.value.isSame(expected, "day"));
  });
});
