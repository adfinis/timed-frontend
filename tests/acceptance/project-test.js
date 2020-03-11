import { click, fillIn, visit, currentURL } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { selectChoose } from "ember-power-select/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | projects", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    const user = this.server.create("user", { isReviewer: true });
    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id });

    this.server.create("project", { reviewers: [user] });
  });

  test("can visit /projects", async function(assert) {
    await visit("/projects");
    assert.equal(currentURL(), "/projects");

    assert.dom("[data-test-project-selection]").exists();
    assert.dom("[data-test-no-project-selected]").exists();
  });

  test("can select project", async function(assert) {
    await visit("/projects");
    assert.equal(currentURL(), "/projects");

    assert.dom("[data-test-project-selection]").exists();
    await selectChoose(
      "[data-test-project-selection]",
      ".ember-power-select-option",
      0
    );

    assert.dom("[data-test-no-project-selected]").doesNotExist();
    assert.dom("[data-test-tasks-table]").exists();
    assert.dom("[data-test-add-task]").exists();
    assert.dom("[data-test-task-table-row]").doesNotExist();
  });

  test("can add task", async function(assert) {
    await visit("/projects");
    assert.equal(currentURL(), "/projects");

    await selectChoose(
      "[data-test-project-selection]",
      ".ember-power-select-option",
      0
    );

    assert.dom("[data-test-add-task]").exists();
    assert.dom("[data-test-task-table-row]").doesNotExist();

    await click("[data-test-add-task]");
    assert.dom("[data-test-task-form]").exists();
    assert.dom("[data-test-save]").isDisabled();

    await fillIn("[data-test-name] input", "FooBar Task 1");
    assert.dom("[data-test-save]").isNotDisabled();

    await fillIn("[data-test-reference] input", "Reference of FooBar Task 1");
    await fillIn("[data-test-estimated-time]", "02:15");

    await click("[data-test-save]");

    assert.dom("[data-test-name] input").hasValue("FooBar Task 1");
    assert
      .dom("[data-test-reference] input")
      .hasValue("Reference of FooBar Task 1");
    assert.dom("[data-test-estimated-time]").hasValue("02:15");
    assert.dom("[data-test-task-table-row]").exists({ count: 1 });
  });

  test("can edit task", async function(assert) {
    await visit("/projects");
    assert.equal(currentURL(), "/projects");

    await selectChoose(
      "[data-test-project-selection]",
      ".ember-power-select-option",
      0
    );

    assert.dom("[data-test-add-task]").exists();
    assert.dom("[data-test-task-table-row]").doesNotExist();

    await click("[data-test-add-task]");
    assert.dom("[data-test-task-form]").exists();
    assert.dom("[data-test-save]").isDisabled();

    await fillIn("[data-test-name] input", "FooBar Task 1");
    assert.dom("[data-test-save]").isNotDisabled();

    await fillIn("[data-test-reference] input", "Reference of FooBar Task 1");
    await fillIn("[data-test-estimated-time]", "02:15");

    await click("[data-test-save]");
    await click("[data-test-cancel]");

    assert.dom("[data-test-task-form]").doesNotExist();
    assert.dom("[data-test-table-name]").hasText("FooBar Task 1");
    assert
      .dom("[data-test-table-reference]")
      .hasText("Reference of FooBar Task 1");
    assert.dom("[data-test-table-estimated-time]").hasText("2h 15m");
    assert.dom("[data-test-table-archived]").hasClass("fa-square-o");

    await click("[data-test-task-table-row]");

    assert.dom("[data-test-task-form]").exists();
    await fillIn("[data-test-name] input", "FooBar Task 1 updated");
    await fillIn("[data-test-reference] input", "");
    await fillIn("[data-test-estimated-time]", "");
    await click("[data-test-archived] input");

    await click("[data-test-save]");
    await click("[data-test-cancel]");

    assert.dom("[data-test-task-form]").doesNotExist();
    assert.dom("[data-test-table-name]").hasText("FooBar Task 1 updated");
    assert.dom("[data-test-table-reference]").hasText("-");
    assert.dom("[data-test-table-estimated-time]").hasText("-");
    assert.dom("[data-test-table-archived]").hasClass("fa-check-square-o");
  });
});
