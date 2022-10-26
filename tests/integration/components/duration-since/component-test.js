import { hbs } from 'ember-cli-htmlbars';
import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | duration since", function(hooks) {
  setupRenderingTest(hooks);

  test("computes the duration correctly", async function(assert) {
    this.set(
      "start",
      moment()
        .milliseconds(0)
        .subtract({
          minutes: 5,
          seconds: 5
        })
    );

    await render(hbs`{{duration-since start}}`);

    assert.ok(this.element);
    assert.dom(this.element).hasText("00:05:05");
  });

  test("computes the duration correctly with elapsed time", async function(assert) {
    this.set(
      "start",
      moment().subtract({
        minutes: 5,
        seconds: 5
      })
    );

    this.set(
      "elapsed",
      moment.duration({
        hours: 1,
        minutes: 1,
        seconds: 1
      })
    );

    await render(hbs`{{duration-since start elapsed=elapsed}}`);

    assert.ok(this.element);
    assert.dom(this.element).hasText("01:06:06");
  });
});
