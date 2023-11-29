import { click, fillIn, visit, waitFor } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";
import sinon from "sinon";

import taskSelect from "../helpers/task-select";

module("Acceptance | magic links", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    this.server.createList("report", 5, { userId: user.id });
  });

  test("can create a magic link", async function (assert) {
    await visit("/reports");

    await click("[data-test-magic-link-btn]");

    assert.dom("[data-test-magic-link-form]").isVisible();

    await waitFor(".customer-select");
    await taskSelect("[data-test-task-selector] div");
    await fillIn("[data-test-magic-link-comment]", "some great comment");

    await fillIn("[data-test-magic-link-duration]", "02:00");

    await click("[data-test-magic-link-review]");
    await click("[data-test-magic-link-not-billable]");

    assert
      .dom("[data-test-magic-link-string]")
      .hasValue(/task=2/, "contains the task param");
    assert
      .dom("[data-test-magic-link-string]")
      .hasValue(/duration=PT2H/, "contains the duration param");
    assert
      .dom("[data-test-magic-link-string]")
      .hasValue(/comment=some%20great%20comment/, "contains the comment param");
    assert
      .dom("[data-test-magic-link-string]")
      .hasValue(/review=true/, "contains the review param");
    assert
      .dom("[data-test-magic-link-string]")
      .hasValue(/notBillable=true/, "contains the not billable param");
  });

  test("can create a new draft report from a magic link", async function (assert) {
    await visit(
      "/reports?task=2&duration=PT2H&comment=some+great+comment&review=true&notBillable=true"
    );
    const task = this.server.db.tasks.find(2);
    const project = this.server.db.projects.find(task.projectId);
    const customer = this.server.db.customers.find(project.customerId);

    assert.dom("[data-test-report-row]").exists({ count: 6 });

    assert
      .dom(
        "[data-test-report-row]:last-child .customer-select .ember-power-select-selected-item"
      )
      .containsText(customer.name, "it sets the correct customer");
    assert
      .dom(
        "[data-test-report-row]:last-child .project-select .ember-power-select-selected-item"
      )
      .containsText(project.name, "it sets the correct project");
    assert
      .dom(
        "[data-test-report-row]:last-child .task-select .ember-power-select-selected-item"
      )
      .containsText(task.name, "it sets the correct task");
    assert
      .dom("[data-test-report-row]:last-child .comment-field")
      .hasValue("some great comment", "it sets the correct comment");
    assert
      .dom("[data-test-report-row]:last-child [data-test-report-duration]")
      .hasValue("02:00");
    assert
      .dom("[data-test-report-row]:last-child [data-test-report-review]")
      .hasClass("active");
    assert
      .dom("[data-test-report-row]:last-child [data-test-report-not-billable]")
      .hasClass("active");

    await click("[data-test-report-row]:last-child [data-test-save-report]");
    assert.dom("[data-test-report-row]").exists({ count: 7 });
  });

  test("it resets the magic link form after creating a link", async function (assert) {
    await visit("/reports");

    await click("[data-test-magic-link-btn]");

    assert.dom("[data-test-magic-link-form]").isVisible();

    await waitFor(".customer-select");
    await taskSelect("[data-test-task-selector] div");
    await fillIn("[data-test-magic-link-comment]", "some great comment");
    await fillIn("[data-test-magic-link-duration]", "02:00");

    sinon.stub(navigator.clipboard, "writeText");
    await click("[data-test-create-magic-link-btn]");

    await click("[data-test-magic-link-form] button.close");

    await click("[data-test-magic-link-btn]");

    assert.dom("[data-test-magic-link-comment]").hasNoValue();
    assert.dom("[data-test-magic-link-duration]").hasValue("00:00");
  });
});
