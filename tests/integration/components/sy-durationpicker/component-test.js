import {
  fillIn,
  blur,
  render,
  triggerKeyEvent,
  settled,
} from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";
import formatDuration from "timed/utils/format-duration";

module("Integration | Component | sy durationpicker", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("value", moment.duration({ h: 1, m: 30 }));

    await render(hbs`<SyDurationpicker @value={{this.value}} />`);

    assert.dom("input").hasValue("01:30");
  });

  test("renders default duration when none passed", async function (assert) {
    this.set("value", null);

    await render(hbs`<SyDurationpicker @value={{this.value}} />`);

    assert.dom("input").hasValue("00:00");
  });

  test("can change the value", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    await fillIn("input", "13:15");
    await blur("input");

    assert.equal(this.value.hours(), 13);
    assert.equal(this.value.minutes(), 15);
  });

  test("can set a negative value", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    await fillIn("input", "-13:00");
    await blur("input");

    assert.equal(this.value.hours(), -13);
  });

  test("can't set an invalid value", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    await fillIn("input", "abcdef");
    await blur("input");

    assert.equal(this.value.hours(), 12);
    assert.equal(this.value.minutes(), 30);
  });

  test("can increase minutes per arrow", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 38));

    await settled();

    assert.equal(this.value.hours(), 12);
    assert.equal(this.value.minutes(), 30);
  });

  test("can decrease minutes per arrow", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 40));

    await settled();

    assert.equal(this.value.hours(), 12);
    assert.equal(this.value.minutes(), 0);
  });

  test("can't be bigger than max or smaller than min", async function (assert) {
    this.set(
      "value",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    this.set(
      "min",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    this.set(
      "max",
      moment.duration({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`<SyDurationpicker @min={{this.min}} @max={{this.max}} @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 38));

    await settled();

    assert.equal(this.value.hours(), 12);
    assert.equal(this.value.minutes(), 30);

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 40));

    await settled();

    assert.equal(this.value.hours(), 12);
    assert.equal(this.value.minutes(), 30);
  });

  test("can set a negative value with minutes", async function (assert) {
    this.set("value", null);

    await render(
      hbs`<SyDurationpicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`
    );

    await fillIn("input", "-04:30");
    await blur("input");

    assert.equal(this.value.hours(), -4);
    assert.equal(this.value.minutes(), -30);

    assert.equal(formatDuration(this.value, false), "-04:30");
  });
});
