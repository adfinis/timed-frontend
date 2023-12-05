import { fillIn, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | sy calendar", function (hooks) {
  setupRenderingTest(hooks);

  test("can select a year", async function (assert) {
    assert.expect(1);
    this.set("center", moment({ y: 2017, m: 10, d: 7 }));
    this.set("onCenterChangeHandler", (value) => {
      this.center = value.moment;
    });

    await render(hbs`
      <SyCalendar
        @center={{this.center}}
        @onCenterChange={{this.onCenterChangeHandler}}
      />
    `);

    await fillIn(".nav-select-year select", "2010");

    assert.strictEqual(this.center.year(), 2010);
  });

  test("can select a month", async function (assert) {
    assert.expect(1);
    this.set("center", moment({ y: 2017, m: 10, d: 7 }));
    this.set("onCenterChangeHandler", (value) => {
      this.center = value.moment;
    });

    await render(hbs`
      <SyCalendar
        @center={{this.center}}
        @onCenterChange={{this.onCenterChangeHandler}}
      />
    `);

    await fillIn(".nav-select-month select", "May");

    assert.strictEqual(this.center.month(), 4);
  });
});
