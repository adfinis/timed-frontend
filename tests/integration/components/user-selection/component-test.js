import { find, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Integration | Component | user selection", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    assert.expect(1);
    const user = this.server.create("user");
    this.set("user", user);

    await render(hbs`
      <UserSelection @user={{this.user}} @onChange={{fn (mut this.user)}} as |u|>
        {{u.user}}
      </UserSelection>
    `);

    assert.strictEqual(
      find(".user-select .ember-power-select-selected-item").textContent.trim(),
      user.longName
    );
  });
});
