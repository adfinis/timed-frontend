import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | analysis edit", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    const user = this.server.create("user", { isSuperuser: true });
    this.user = user;

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    this.reportIntersection = this.server.create("report-intersection", {
      verified: false,
      review: true
    });
  });

  test("can visit /analysis/edit", async function(assert) {
    await visit("/analysis/edit");

    assert.equal(currentURL(), "/analysis/edit");
  });

  test("can edit", async function(assert) {
    await visit("/analysis/edit?id=1,2,3");

    let res = {};

    this.server.post("/reports/bulk", (_, { requestBody }) => {
      res = JSON.parse(requestBody);
    });

    await fillIn("[data-test-comment] input", "test comment 123");
    await click("[data-test-not-billable] input");
    await click("[data-test-review] input");

    await click(".btn-primary");

    const {
      data: { type, attributes, relationships }
    } = res;

    assert.equal(type, "report-bulks");

    // only changed attributes were sent
    assert.deepEqual(Object.keys(attributes), [
      "comment",
      "not-billable",
      "review"
    ]);
    assert.deepEqual(Object.keys(relationships), [
      "customer",
      "project",
      "task"
    ]);

    assert.equal(currentURL(), "/analysis");
  });

  test("can cancel", async function(assert) {
    await visit("/analysis/edit");

    await click("[data-test-cancel]");

    assert.equal(currentURL(), "/analysis");
  });

  test("can reset", async function(assert) {
    await visit("/analysis/edit");

    const initialValue = this.element.querySelector("[data-test-comment] input")
      .value;

    await fillIn("[data-test-comment] input", "test");

    assert.dom("[data-test-comment] input").hasValue("test");

    await click("[data-test-reset]");

    assert.dom("[data-test-comment] input").hasValue(initialValue);
  });

  test("can not verify", async function(assert) {
    await visit("/analysis/edit");

    assert.dom("[data-test-verified] input").isDisabled();
  });

  test("cannot verify unreviewed reports", async function(assert) {
    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isDisabled();
    assert
      .dom("[data-test-verified] label")
      .hasAttribute(
        "title",
        "Please review selected reports before verifying."
      );
  });

  test("can verify reviewed reports", async function(assert) {
    this.reportIntersection.update({ review: false });
    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isNotDisabled();
    assert.dom("[data-test-verified] label").hasAttribute("title", "");
  });

  test("cannot verify report if no reviewer or superuser", async function(assert) {
    this.reportIntersection.update({ review: false });
    const user = this.server.create("user");

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isDisabled();
    assert
      .dom("[data-test-verified] label")
      .hasAttribute(
        "title",
        "Please select yourself as 'reviewer' to verify reports."
      );
  });
});
