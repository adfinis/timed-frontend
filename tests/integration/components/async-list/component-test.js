import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | async list", function (hooks) {
  setupRenderingTest(hooks);

  test("yields list on success", async function (assert) {
    this.data = { last: { value: ["a", "b"] } };

    await render(hbs`
      {{#async-list this.data as |section data|}}
        {{#if (eq section 'body')}}
          {{#each data as |d|}}
            <div class="item">{{d}}</div>
          {{/each}}
        {{/if}}
      {{/async-list}}
    `);

    assert.dom("div.item").exists({ count: 2 });
  });

  test("yields empty section", async function (assert) {
    this.data = { last: { value: [] } };

    await render(hbs`
      {{#async-list this.data as |section data|}}
        {{#if (eq section 'empty')}}
          <div class="check-me"></div>
        {{/if}}
      {{/async-list}}
    `);

    assert.dom(".check-me").exists();
  });

  test("shows loading icon", async function (assert) {
    this.data = { isRunning: true };

    await render(hbs`
      {{#async-list this.data}}{{/async-list}}
    `);

    assert.dom(".loading-icon").exists();
  });

  test("shows error message", async function (assert) {
    this.data = { last: { isError: true } };

    await render(hbs`
      {{#async-list this.data as |section data|}}{{/async-list}}
    `);

    assert.dom(".fa-bolt").exists();
  });
});
