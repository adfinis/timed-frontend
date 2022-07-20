import {
  fillIn,
  blur,
  render,
  triggerKeyEvent,
  settled,
} from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | sy timepicker", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("value", moment());

    await render(hbs`{{sy-timepicker value=value}}`);

    assert.dom("input").hasValue(moment().format("HH:mm"));
  });

  test("can change the value", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    await fillIn("input", "13:15");
    await blur("input");

    assert.equal(this.value.hour(), 13);
    assert.equal(this.value.minute(), 15);
  });

  test("can't set an invalid value", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    await fillIn("input", "24:15");
    await blur("input");

    assert.equal(this.value.hour(), 12);
    assert.equal(this.value.minute(), 30);
  });

  test("can only input digits and colons", async function (assert) {
    this.set("value", null);

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    await fillIn("input", "xx:xx");
    await blur("input");

    assert.equal(this.value, null);

    await fillIn("input", "01:30");
    await blur("input");

    assert.notEqual(this.value, null);
  });

  test("can increase minutes per arrow", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 38)
      );

    await settled();

    assert.equal(this.value.hour(), 12);
    assert.equal(this.value.minute(), 30);
  });

  test("can decrease minutes per arrow", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 40)
      );

    await settled();

    assert.equal(this.value.hour(), 12);
    assert.equal(this.value.minute(), 0);
  });

  test("can increase hours per arrow with shift", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) =>
          await triggerKeyEvent(element, "keydown", 38, { shiftKey: true })
      );

    await settled();

    assert.equal(this.value.hour(), 13);
    assert.equal(this.value.minute(), 15);
  });

  test("can decrease minutes per arrow with shift", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) =>
          await triggerKeyEvent(element, "keydown", 40, { shiftKey: true })
      );

    await settled();

    assert.equal(this.value.hour(), 11);
    assert.equal(this.value.minute(), 15);
  });

  test("can increase hours per arrow with ctrl", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) =>
          await triggerKeyEvent(element, "keydown", 38, { ctrlKey: true })
      );

    await settled();

    assert.equal(this.value.hour(), 13);
    assert.equal(this.value.minute(), 15);
  });

  test("can decrease minutes per arrow with ctrl", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 15,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) =>
          await triggerKeyEvent(element, "keydown", 40, { ctrlKey: true })
      );

    await settled();

    assert.equal(this.value.hour(), 11);
    assert.equal(this.value.minute(), 15);
  });

  test("can't change day", async function (assert) {
    this.set(
      "value",
      moment({
        h: 23,
        m: 45,
      })
    );

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 38)
      );

    await settled();

    assert.equal(this.value.hour(), 23);
    assert.equal(this.value.minute(), 45);
  });

  test("can't be bigger than max or smaller than min", async function (assert) {
    this.set(
      "value",
      moment({
        h: 12,
        m: 30,
      })
    );

    this.set(
      "min",
      moment({
        h: 12,
        m: 30,
      })
    );

    this.set(
      "max",
      moment({
        h: 12,
        m: 30,
      })
    );

    await render(
      hbs`{{sy-timepicker min=min max=max value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 38)
      );

    await settled();

    assert.equal(this.value.hour(), 12);
    assert.equal(this.value.minute(), 30);

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 40)
      );

    await settled();

    assert.equal(this.value.hour(), 12);
    assert.equal(this.value.minute(), 30);
  });

  test("respects the precision", async function (assert) {
    this.set(
      "value",
      moment({
        h: 10,
        m: 0,
      })
    );

    await render(
      hbs`{{sy-timepicker precision=5 value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 38)
      );

    await settled();

    assert.equal(this.value.hour(), 10);
    assert.equal(this.value.minute(), 5);
  });

  test("can handle null values", async function (assert) {
    this.set("value", moment({ h: 12, m: 30 }));

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    await fillIn("input", "");
    await blur("input");

    assert.equal(this.get("value"), null);
  });

  test("can handle null values with arrow up", async function (assert) {
    this.set("value", null);

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 38)
      );

    await settled();

    assert.equal(this.value.hour(), 0);
    assert.equal(this.value.minute(), 15);
  });

  test("can handle null values with arrow down", async function (assert) {
    this.set("value", null);

    await render(
      hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`
    );

    this.element
      .querySelectorAll("input")
      .forEach(
        async (element) => await triggerKeyEvent(element, "keydown", 40)
      );

    await settled();

    assert.equal(this.value.hour(), 23);
    assert.equal(this.value.minute(), 45);
  });
});
