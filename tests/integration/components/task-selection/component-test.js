import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import wait from "ember-test-helpers/wait";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";
import { startMirage } from "timed/initializers/ember-cli-mirage";

const CUSTOMER = EmberObject.create({
  id: 1,
  name: "Test Customer"
});

const PROJECT = EmberObject.create({
  id: 1,
  name: "Test Project",
  customer: CUSTOMER
});

const TASK = EmberObject.create({
  id: 1,
  name: "Test Task",
  project: PROJECT
});

module("Integration | Component | task selection", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test("renders", async function(assert) {
    await render(hbs`
      {{#task-selection as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `);

    assert.dom(".customer-select [aria-disabled=true]").doesNotExist();
    assert.dom(".project-select [aria-disabled=true]").exists();
    assert.dom(".task-select [aria-disabled=true]").exists();
  });

  test("can set initial customer", async function(assert) {
    assert.expect(4);
    this.set("customer", CUSTOMER);

    await render(hbs`
      {{#task-selection
        initial    = (hash
          customer = customer
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `);

    return wait().then(() => {
      assert.dom(".customer-select [aria-disabled=true]").doesNotExist();
      assert.dom(".project-select [aria-disabled=true]").doesNotExist();
      assert.dom(".task-select [aria-disabled=true]").exists();

      assert.strictEqual(
        this.element
          .querySelector(".customer-select .ember-power-select-selected-item")
          .innerHTML.trim(),
        CUSTOMER.name
      );
    });
  });

  test("can set initial project", async function(assert) {
    assert.expect(5);
    this.set("project", PROJECT);

    await render(hbs`
      {{#task-selection
        initial   = (hash
          project = project
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `);

    return wait().then(() => {
      assert.dom(".customer-select [aria-disabled=true]").doesNotExist();
      assert.dom(".project-select [aria-disabled=true]").doesNotExist();
      assert.dom(".task-select [aria-disabled=true]").doesNotExist();

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
  });

  test("can set initial task", async function(assert) {
    assert.expect(6);
    this.set("task", TASK);

    await render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `);

    return wait().then(() => {
      assert.dom(".customer-select [aria-disabled=true]").doesNotExist();
      assert.dom(".project-select [aria-disabled=true]").doesNotExist();
      assert.dom(".task-select [aria-disabled=true]").doesNotExist();

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
  });

  test("can clear customer", async function(assert) {
    assert.expect(0);

    this.set("task", TASK);

    await render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `);
  });

  test("can clear all filters", async function(assert) {
    this.set("task", TASK);

    await render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
        <button {{action t.clear}}></button>
      {{/task-selection}}
    `);

    await click("button");

    return wait().then(() => {
      assert
        .dom(".customer-select .ember-power-select-selected-item")
        .doesNotExist();
      assert
        .dom(".project-select .ember-power-select-selected-item")
        .doesNotExist();
      assert
        .dom(".task-select .ember-power-select-selected-item")
        .doesNotExist();
    });
  });
});
