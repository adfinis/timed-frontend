import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";
import { startMirage } from "timed/initializers/ember-cli-mirage";

module("Integration | Component | report row", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test("renders", async function(assert) {
    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() })
    );

    await render(hbs`{{report-row report}}`);

    assert.dom("form").exists({ count: 1 });
    assert.dom(".form-group").exists({ count: 8 });
    assert.dom(".btn-danger").exists({ count: 1 });
    assert.dom(".btn-primary").exists({ count: 1 });
  });

  test("can delete row", async function(assert) {
    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() })
    );
    this.set("didDelete", false);

    await render(hbs`
      {{report-row
        report
        on-delete=(action (mut didDelete) true)
      }}
    `);

    await click(".btn-danger");

    assert.ok(this.didDelete);
  });

  test("can be read-only", async function(assert) {
    this.set(
      "report",
      EmberObject.create({
        verifiedBy: EmberObject.create({
          id: 1,
          fullName: "John Doe"
        }),
        billed: true
      })
    );

    await render(hbs`{{report-row report}}`);

    assert.dom("input").isDisabled();
    assert.dom("form").hasAttribute("title", /John Doe/);
    assert.dom(".btn").doesNotExist();

    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() })
    );

    assert.dom("input").isNotDisabled();
    assert.dom("form").hasAttribute("title", "");
    assert.dom(".btn").exists({ count: 2 });
  });
});
