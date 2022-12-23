import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const CUSTOMER = EmberObject.create({
  id: 1,
  name: "Test Customer",
});

const PROJECT = EmberObject.create({
  id: 1,
  name: "Test Project",
  customer: CUSTOMER,
});

const TASK = EmberObject.create({
  id: 1,
  name: "Test Task",
  project: PROJECT,
});

module("Integration | Component | task selection", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(hbs`
      <TaskSelection as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    assert.dom(".customer-select[aria-disabled=true]").doesNotExist();
    assert.dom(".project-select[aria-disabled=true]").exists();
    assert.dom(".task-select[aria-disabled=true]").exists();
  });

  test("can set initial customer", async function (assert) {
    assert.expect(4);
    this.set("customer", CUSTOMER);

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          customer = customer
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    assert.dom(".customer-select[aria-disabled=true]").doesNotExist();
    assert.dom(".project-select[aria-disabled=true]").doesNotExist();
    assert.dom(".task-select[aria-disabled=true]").exists();

    assert.strictEqual(
      this.element
        .querySelector(".customer-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      CUSTOMER.name
    );
  });

  test("can set initial project", async function (assert) {
    assert.expect(5);
    this.set("project", PROJECT);

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          project = project
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    assert.dom(".customer-select[aria-disabled=true]").doesNotExist();
    assert.dom(".project-select[aria-disabled=true]").doesNotExist();
    assert.dom(".task-select[aria-disabled=true]").doesNotExist();

    assert.strictEqual(
      this.element
        .querySelector(".customer-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      CUSTOMER.name
    );
    assert.strictEqual(
      this.element
        .querySelector(".project-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      PROJECT.name
    );
  });

  test("can set initial task", async function (assert) {
    assert.expect(6);
    this.set("task", TASK);

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = task
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    assert.dom(".customer-select[aria-disabled=true]").doesNotExist();
    assert.dom(".project-select[aria-disabled=true]").doesNotExist();
    assert.dom(".task-select[aria-disabled=true]").doesNotExist();

    assert.strictEqual(
      this.element
        .querySelector(".customer-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      CUSTOMER.name
    );
    assert.strictEqual(
      this.element
        .querySelector(".project-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      PROJECT.name
    );
    assert.strictEqual(
      this.element
        .querySelector(".task-select .ember-power-select-selected-item")
        .innerHTML.trim(),
      TASK.name
    );
  });

  test("can clear customer", async function (assert) {
    assert.expect(0);

    this.set("task", TASK);

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = task
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);
  });

  test("can clear all filters", async function (assert) {
    this.set("task", TASK);

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = task
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
        <button {{on "click" t.clear}}></button>
      </TaskSelection>
    `);

    await click("button");

    assert
      .dom(".customer-select .ember-power-select-selected-item")
      .doesNotExist();
    assert
      .dom(".project-select .ember-power-select-selected-item")
      .doesNotExist();
    assert.dom(".task-select .ember-power-select-selected-item").doesNotExist();
  });
});
