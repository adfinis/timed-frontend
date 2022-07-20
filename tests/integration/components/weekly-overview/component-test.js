import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | weekly overview", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("expected", moment.duration({ h: 8 }));

    await render(hbs`{{weekly-overview expected=expected}}`);

    assert.ok(this.element);
  });

  test("renders the benchmarks", async function (assert) {
    this.set("expected", moment.duration({ h: 8 }));

    await render(hbs`{{weekly-overview expected=expected}}`);

    // 11 (evens from 0 to 20) plus the expected
    assert.dom("hr").exists({ count: 12 });
  });

  test("renders the days", async function (assert) {
    this.set("day", moment());
    this.set("expected", moment.duration({ h: 8 }));
    this.set("worktime", moment.duration({ h: 8 }));

    await render(hbs`
      {{#weekly-overview expected=expected}}
        {{weekly-overview-day day=day expected=expected worktime=worktime}}
      {{/weekly-overview}}
    `);

    assert.dom(".bar").exists();
  });
});
