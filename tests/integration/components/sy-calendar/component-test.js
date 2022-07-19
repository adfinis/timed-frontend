import { fillIn, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import wait from "ember-test-helpers/wait";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | sy calendar", function (hooks) {
  setupRenderingTest(hooks);

  test("can select a year", async function (assert) {
    assert.expect(1);

    this.set("center", moment({ y: 2017, m: 10, d: 7 }));

    await render(hbs`
      {{sy-calendar
        center=center
        onCenterChange=(action (mut center) value='moment')
      }}
    `);

    await fillIn(".nav-select-year select", "2010");

    return wait().then(() => {
      assert.equal(this.center.year(), 2010);
    });
  });

  test("can select a month", async function (assert) {
    assert.expect(1);

    this.set("center", moment({ y: 2017, m: 10, d: 7 }));

    await render(hbs`
      {{sy-calendar
        center=center
        onCenterChange=(action (mut center) value='moment')
      }}
    `);

    await fillIn(".nav-select-month select", "May");

    return wait().then(() => {
      assert.equal(this.center.month(), 4);
    });
  });
});
