import { triggerKeyEvent, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import {
  typeInSearch,
  clickTrigger,
} from "ember-power-select/test-support/helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import taskOptionTemplate from "timed/components/optimized-power-select/custom-options/task-option";
import customSelectedTemplate from "timed/components/optimized-power-select/custom-select/task-selection";

const OPTIONS = [
  { id: 1, name: "Test 1" },
  { id: 2, name: "Test 2" },
  { id: 3, name: "Test 3" },
];

module("Integration | Component | optimized power select", function (hooks) {
  setupRenderingTest(hooks);

  test("can use blockless", async function (assert) {
    this.set("options", OPTIONS);
    this.set("selected", OPTIONS[0]);

    this.set("selectedTemplate", customSelectedTemplate);
    this.set("optionTemplate", taskOptionTemplate);

    await render(hbs`
      {{(component
          (ensure-safe-component "optimized-power-select")
          options            = this.options
          selected           = this.selected
          onChange           = (fn (mut this.selected))
          tagName            = 'div'
          renderInPlace      = true
          searchField        = 'name'
          extra              = (hash
            optionTemplate   = this.optionTemplate
            selectedTemplate = this.selectedTemplate
          )
        )
      }}
    `);

    await clickTrigger();

    assert.dom(".ember-power-select-selected-item").hasText("Test 1");
    assert.dom(".ember-power-select-option:first-of-type").hasText("Test 1");
  });

  test("can select with return key", async function (assert) {
    assert.expect(1);
    this.set("options", OPTIONS);
    this.set("selected", OPTIONS[0]);

    this.set("selectedTemplate", customSelectedTemplate);
    this.set("optionTemplate", taskOptionTemplate);

    await render(hbs`
      {{(component
          (ensure-safe-component "optimized-power-select")
          options            = this.options
          selected           = this.selected
          onChange           = (fn (mut this.selected))
          tagName            = 'div'
          renderInPlace      = true
          searchField        = 'name'
          extra              = (hash
            optionTemplate   = this.optionTemplate
            selectedTemplate = this.selectedTemplate
          )
        )
      }}
    `);

    await clickTrigger();
    await typeInSearch("2");

    await triggerKeyEvent(".ember-power-select-search-input", "keydown", 13);

    assert.strictEqual(this.selected.id, 2);
  });

  test("can select with tab key", async function (assert) {
    assert.expect(1);
    this.set("options", OPTIONS);
    this.set("selected", OPTIONS[0]);

    this.set("selectedTemplate", customSelectedTemplate);
    this.set("optionTemplate", taskOptionTemplate);

    await render(hbs`
      {{(component
          (ensure-safe-component "optimized-power-select")
          options            = this.options
          selected           = this.selected
          onChange           = (fn (mut this.selected))
          tagName            = 'div'
          renderInPlace      = true
          searchField        = 'name'
          extra              = (hash
            optionTemplate   = this.optionTemplate
            selectedTemplate = this.selectedTemplate
          )
        )
      }}
    `);

    await clickTrigger();
    await typeInSearch("2");

    await triggerKeyEvent(".ember-power-select-search-input", "keydown", 9);

    assert.strictEqual(this.selected.id, 2);
  });
});
