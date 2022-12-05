import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

const ATTENDANCE = EmberObject.create({
  from: moment({ h: 8, m: 0, s: 0, ms: 0 }),
  to: moment({ h: 8, m: 0, s: 0, ms: 0 }),
});

module("Integration | Component | attendance slider", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("attendance", ATTENDANCE);

    await render(hbs`
      {{attendance-slider attendance=attendance}}
    `);

    assert.dom(".noUi-connect").exists();
  });

  test("can delete", async function (assert) {
    assert.expect(1);
    this.set("attendance", ATTENDANCE);

    this.set("deleteAction", (attendance) => {
      assert.ok(attendance);
    });

    await render(hbs`
      {{attendance-slider
        attendance = attendance
        on-delete  = deleteAction
      }}
    `);

    await click(".fa-trash");
  });

  test("can handle attendances until 00:00", async function (assert) {
    this.set(
      "attendance",
      EmberObject.create({
        from: moment({ h: 0, m: 0, s: 0 }),
        to: moment({ h: 0, m: 0, s: 0 }),
      })
    );

    await render(hbs`
      {{attendance-slider attendance=attendance}}
    `);

    assert.dom("span").hasText("24:00");
  });
});
