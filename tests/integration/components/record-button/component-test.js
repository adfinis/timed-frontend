import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | record button", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<RecordButton />`);
    assert.dom("[data-test-record-start]").exists();
    assert.dom("[data-test-record-stop]").doesNotExist();
  });

  test("can stop", async function (assert) {
    this.set("recording", true);
    this.set("activity", { id: 1 });

    this.set("stopAction", () => {
      this.set("recording", false);

      assert.step("stop");
      assert.dom("[data-test-record-stop]").doesNotExist();
    });

    await render(hbs`
      <RecordButton
        @recording={{this.recording}}
        @activity={{this.activity}}
        @onStop={{this.stopAction}}
      />
    `);

    await click("[data-test-record-stop]");

    assert.verifySteps(["stop"]);
  });

  test("can start", async function (assert) {
    this.set("recording", false);
    this.set("activity", { id: 1 });

    this.set("startAction", () => {
      this.set("recording", true);

      assert.step("start");
      assert.dom("[data-test-record-stop]").exists({ count: 1 });
    });

    await render(hbs`
      <RecordButton
        @recording={{this.recording}}
        @activity={{this.activity}}
        @onStart={{this.startAction}}
      />
    `);

    await click("[data-test-record-start]");

    assert.verifySteps(["start"]);
  });
});
