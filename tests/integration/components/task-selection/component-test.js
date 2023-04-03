import { A } from "@ember/array";
import EmberObject from "@ember/object";
import { click, render, tab, triggerEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const CUSTOMER = EmberObject.create({
  id: 1,
  name: "Test Customer",
});

const TASK = EmberObject.create({
  id: 1,
  name: "Test Task",
});

const TASK_ARCHIVED = EmberObject.create({
  id: 1,
  name: "Test Task",
  archived: true,
});

const PROJECT = EmberObject.create({
  id: 1,
  name: "Test Project",
  customer: CUSTOMER,
  tasks: A([TASK, TASK_ARCHIVED]),
});

TASK.project = PROJECT;
TASK_ARCHIVED.project = PROJECT;

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
    this.customer = CUSTOMER;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          customer = this.customer
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
    this.project = PROJECT;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          project = this.project
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
    this.task = TASK;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = this.task
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

  test("can clear only task", async function (assert) {
    this.task = TASK;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = this.task
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    await click(".task-select .ember-power-select-clear-btn");

    assert.dom(".customer-select .ember-power-select-selected-item").exists();
    assert.dom(".project-select .ember-power-select-selected-item").exists();
    assert.dom(".task-select .ember-power-select-selected-item").doesNotExist();
  });

  test("can clear project and task", async function (assert) {
    this.task = TASK;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = this.task
        )}}
      as |t|>
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      </TaskSelection>
    `);

    await click(".project-select .ember-power-select-clear-btn");

    assert.dom(".customer-select .ember-power-select-selected-item").exists();
    assert
      .dom(".project-select .ember-power-select-selected-item")
      .doesNotExist();
    assert.dom(".task-select .ember-power-select-selected-item").doesNotExist();
  });

  test("can clear all filters", async function (assert) {
    this.task = TASK;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          task  = this.task
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

  test("opens on tab-key navigation", async function (assert) {
    this.customer = CUSTOMER;
    this.project = PROJECT;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          customer = this.customer
          project = this.project
        )}}
        as |t|>
          {{t.customer}}
          {{t.project}}
      </TaskSelection>
    `);

    await triggerEvent(".customer-select", "focus");
    await tab();

    assert.dom(".ember-power-select-dropdown").isVisible();
  });

  test("only shows non-archived entries when archived option is passed", async function (assert) {
    this.customer = CUSTOMER;
    this.project = PROJECT;
    this.archived = false;

    await render(hbs`
      <TaskSelection
        @initial={{(hash
          customer = this.customer
          project = this.project
        )}}
        @archived={{this.archived}}
        as |t|>
          {{t.customer}}
          {{t.project}}
          {{t.task}}
      </TaskSelection>
    `);

    await triggerEvent(".task-select", "focus");
    assert.dom(".ember-power-select-option").exists({ count: 1 });

    // focus project dropdown to trigger task select again in next step
    await triggerEvent(".project-select", "focus");
    this.archived = true;

    await triggerEvent(".task-select", "focus");
    assert.dom(".ember-power-select-option").exists({ count: 2 });
  });
});
