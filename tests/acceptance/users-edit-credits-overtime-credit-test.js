import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import moment from "moment";
import { module, test } from "qunit";

module("Acceptance | users edit credits overtime credit", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create("user", { isSuperuser: true });

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id });
  });

  test("can create an overtime credit", async function (assert) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`);

    await fillIn("input[name=date]", moment().format("DD.MM.YYYY"));
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Comment");

    await click("[data-test-overtime-credit-save]");

    assert.equal(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tbody > tr").exists({ count: 1 });
  });

  test("can edit an overtime credit", async function (assert) {
    const { id } = this.server.create("overtime-credit", { user: this.user });

    await visit(`/users/${this.user.id}/credits`);

    await click("[data-test-overtime-credits] tbody > tr:first-child");

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits/overtime-credits/${id}`
    );

    await fillIn("input[name=date]", moment().format("DD.MM.YYYY"));
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Ding dong");

    await click("[data-test-overtime-credit-save]");

    assert.equal(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tbody > tr").exists({ count: 1 });

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(1)"
      )
      .hasText(moment().format("DD.MM.YYYY"));

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(2)"
      )
      .hasText("20h 0m");

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(3)"
      )
      .hasText("Ding dong");
  });

  test("can delete an overtime credit", async function (assert) {
    const { id } = this.server.create("overtime-credit", { user: this.user });

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`);

    await click("[data-test-overtime-credit-delete]");

    assert.equal(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tr").doesNotExist();
  });

  test("redirects to the year of the created overtime credit", async function (assert) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`);

    await fillIn(
      "input[name=date]",
      moment().add(1, "years").format("DD.MM.YYYY")
    );
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Ding dong");

    await click("[data-test-overtime-credit-save]");

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits?year=${moment().year() + 1}`
    );
  });
});
