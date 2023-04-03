import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | weekly overview", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.expected = moment.duration({ h: 8 });

    await render(hbs`{{weekly-overview expected=this.expected}}`);

    assert.ok(this.element);
  });

  test("renders the benchmarks", async function (assert) {
    this.expected = moment.duration({ h: 8 });

    await render(hbs`{{weekly-overview expected=this.expected}}`);

    // 11 (evens from 0 to 20) plus the expected
    assert.dom("hr").exists({ count: 12 });
  });

  test("renders the days", async function (assert) {
    this.day = moment();
    this.expected = moment.duration({ h: 8 });
    this.worktime = moment.duration({ h: 8 });

    await render(hbs`
      {{#weekly-overview expected=this.expected}}
        {{weekly-overview-day day=this.day expected=this.expected worktime=this.worktime}}
      {{/weekly-overview}}
    `);

    assert.dom(".bar").exists();
  });
});
