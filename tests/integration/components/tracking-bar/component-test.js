import Service from "@ember/service";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { task } from "ember-concurrency";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

export const trackingStub = Service.extend({
  init(...args) {
    this._super(...args);

    this.set("activity", { comment: "asdf" });
  },

  customers: task(function* () {
    return yield [];
  }),
  recentTasks: task(function* () {
    return yield [];
  }),
});

module("Integration | Component | tracking bar", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:tracking", trackingStub);
  });

  test("renders", async function (assert) {
    await render(hbs`{{tracking-bar}}`);

    assert.dom("input[type=text]").hasValue("asdf");
  });
});
