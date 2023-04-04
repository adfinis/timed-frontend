import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | date buttons", function (hooks) {
  setupRenderingTest(hooks);

  test("changes the date", async function (assert) {
    const format = "YYYY-MM-DD";
    this.set("fromDate", null);
    this.set("toDate", null);

    await render(
      hbs`<DateButtons
        @onUpdateFromDate={{(action (mut this.fromDate))}}
        @onUpdateToDate={{(action (mut this.toDate))}}
      />
      `
    );

    await click('[data-test-preset-date="0"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().day(1).format(format)
    );
    await click('[data-test-preset-date="1"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().date(1).format(format)
    );
    await click('[data-test-preset-date="2"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().dayOfYear(1).format(format)
    );
    await click('[data-test-preset-date="3"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().subtract(1, "week").day(1).format(format)
    );
    assert.strictEqual(
      this.toDate.format(format),
      moment().subtract(1, "week").day(7).format(format)
    );
    await click('[data-test-preset-date="4"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().subtract(1, "month").startOf("month").format(format)
    );
    assert.strictEqual(
      this.toDate.format(format),
      moment().subtract(1, "month").endOf("month").format(format)
    );
    await click('[data-test-preset-date="5"]');
    assert.strictEqual(
      this.fromDate.format(format),
      moment().subtract(1, "year").startOf("year").format(format)
    );
    assert.strictEqual(
      this.toDate.format(format),
      moment().subtract(1, "year").endOf("year").format(format)
    );
  });
});
