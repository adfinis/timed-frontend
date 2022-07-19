import { click, find, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | weekly overview day", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("day", moment({ y: 2017, m: 4, d: 5 }));
    this.set("expected", moment.duration({ h: 8 }));
    this.set("worktime", moment.duration({ h: 8 }));

    await render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime}}`
    );

    assert.ok(this.element);

    assert.equal(find(".day").textContent.trim(), "05\n  Th");
  });

  test("computes a title", async function (assert) {
    this.set("day", moment({ y: 2017, m: 4, d: 5 }));
    this.set("expected", moment.duration({ h: 8, m: 30 }));
    this.set("worktime", moment.duration({ h: 8, m: 30 }));

    await render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime prefix='Ferien'}}`
    );

    assert
      .dom(this.element.firstElementChild)
      .hasAttribute("title", "Ferien, 8h 30m");
  });

  test("fires on-click action on click", async function (assert) {
    this.set("day", moment({ y: 2017, m: 4, d: 5 }));
    this.set("expected", moment.duration({ h: 8, m: 30 }));
    this.set("worktime", moment.duration({ h: 8, m: 30 }));
    this.set("clicked", false);

    await render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime}}`
    );

    assert.notOk(this.clicked);
    await click(".bar");
    await click(".day");
    assert.notOk(this.clicked);

    await render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime on-click=(action (mut clicked) true)}}`
    );

    assert.notOk(this.clicked);

    await click(".bar");

    assert.ok(this.clicked);

    this.set("clicked", false);

    assert.notOk(this.clicked);

    await click(".day");

    assert.ok(this.clicked);
  });
});
