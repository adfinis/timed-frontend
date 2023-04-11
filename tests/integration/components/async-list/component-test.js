import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | async list", function (hooks) {
  setupRenderingTest(hooks);

  test("yields list on success", async function (assert) {
    this.set("data", { value: ["a", "b"] });

    await render(hbs`
      <AsyncList @data={{this.data}} as |section data|>
        {{#if (eq section 'body')}}
          {{#each data as |d|}}
            <div class="item">{{d}}</div>
          {{/each}}
        {{/if}}
      </AsyncList>
    `);

    assert.dom("div.item").exists({ count: 2 });
  });

  test("yields empty section", async function (assert) {
    this.set("data", { value: [] });

    await render(hbs`
      <AsyncList @data={{this.data}} as |section data|>
        {{#if (eq section 'empty')}}
          <div class="check-me"></div>
        {{/if}}
      </AsyncList>
    `);

    assert.dom(".check-me").exists();
  });

  test("shows loading icon", async function (assert) {
    this.set("data", { isRunning: true });

    await render(hbs`
      <AsyncList @data={{this.data}} />
    `);

    assert.dom(".loading-icon").exists();
  });

  test("shows error message", async function (assert) {
    this.set("data", false);

    await render(hbs`
    <AsyncList @data={{this.data}} as |section data|></AsyncList>
    `);

    assert.dom(".fa-bolt").exists();
  });
});
