import {
  click,
  fillIn,
  currentURL,
  visit,
  find,
  findAll
} from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { selectChoose } from "ember-power-select/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, skip, test } from "qunit";

import config from "../../config/environment";
import userSelect from "../helpers/user-select";

module("Acceptance | analysis", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.user = this.server.create("user");

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id });

    this.server.createList("report", 40, { userId: this.user.id });
  });

  // TODO enable this
  skip("can visit /analysis", async function(assert) {
    await visit("/analysis");

    assert.dom(".table--analysis tbody tr").exists({ count: 21 });

    await find(".table--analysis tbody tr:last-child").scrollIntoView();
  });

  test("can download a file", async function(assert) {
    await visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0
    );

    await click(".export-buttons .btn:first-child");

    assert.dom('[data-download-count="1"]').exists();
  });

  test("disables buttons if export limit exceeded", async function(assert) {
    this.server.get("/reports", function({ reports }) {
      return {
        ...this.serialize(reports.all()),
        meta: { pagination: { count: config.APP.EXPORT_LIMIT + 1 } }
      };
    });

    await visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0
    );

    assert.dom(".export-buttons .btn:first-child").isDisabled();
  });

  test("can filter and reset filter", async function(assert) {
    await visit("/analysis");

    await userSelect("[data-test-filter-user]");
    await fillIn("[data-test-filter-from-date] input", "01.12.2016");
    await fillIn("[data-test-filter-to-date] input", "01.12.2017");
    await click("thead > tr > th:first-child");

    assert.ok(currentURL().includes("user=1"));
    assert.ok(currentURL().includes("fromDate=2016-12-01"));
    assert.ok(currentURL().includes("toDate=2017-12-01"));
    assert.ok(currentURL().includes("ordering=-user__username%2Cid"));

    await click(".filter-sidebar-reset");

    // ordering should not be resetted
    assert.equal(currentURL(), "/analysis?ordering=-user__username%2Cid");
  });

  test("can have initial filters", async function(assert) {
    const params = {
      customer: this.server.create("customer").id,
      project: this.server.create("project").id,
      task: this.server.create("task").id,
      user: this.server.create("user").id,
      reviewer: this.server.create("user").id,
      billingType: this.server.create("billing-type").id,
      costCenter: this.server.create("cost-center").id,
      fromDate: "2016-12-01",
      toDate: "2017-12-01",
      review: "",
      notBillable: "",
      verified: ""
    };

    await visit(
      `/analysis?${Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join("&")}`
    );

    assert
      .dom("[data-test-filter-customer] .ember-power-select-selected-item")
      .exists();
    assert
      .dom("[data-test-filter-project] .ember-power-select-selected-item")
      .exists();
    assert
      .dom("[data-test-filter-task] .ember-power-select-selected-item")
      .exists();
    assert
      .dom("[data-test-filter-user] .ember-power-select-selected-item")
      .exists();
    assert
      .dom("[data-test-filter-reviewer] .ember-power-select-selected-item")
      .exists();
    assert.equal(
      find("[data-test-filter-billing-type] select").selectedIndex,
      1
    );
    assert.equal(
      find("[data-test-filter-cost-center] select").selectedIndex,
      1
    );

    assert.dom("[data-test-filter-from-date] input").hasValue("01.12.2016");
    assert.dom("[data-test-filter-to-date] input").hasValue("01.12.2017");

    assert.equal(
      findAll("[data-test-filter-review] button").indexOf(
        find("[data-test-filter-review] button.active")
      ),
      0
    );
    assert.equal(
      findAll("[data-test-filter-not-billable] button").indexOf(
        find("[data-test-filter-not-billable] button.active")
      ),
      0
    );
    assert.equal(
      findAll("[data-test-filter-verified] button").indexOf(
        find("[data-test-filter-verified] button.active")
      ),
      0
    );
  });

  test("can select a report", async function(assert) {
    await visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0
    );

    await click("tbody > tr:first-child");

    assert.ok(find("tbody > tr:first-child.selected"));

    await click("tbody > tr:first-child");

    assert.notOk(find("tbody > tr:first-child.selected"));
  });

  test("can edit", async function(assert) {
    this.server.create("report-intersection");

    await visit("/analysis?editable=1");

    await click("[data-test-edit-all]");

    assert.equal(currentURL(), "/analysis/edit?editable=1");
  });

  test("can edit selected reports", async function(assert) {
    this.server.create("report-intersection");

    await visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0
    );

    await click("tbody > tr:nth-child(1)");
    await click("tbody > tr:nth-child(2)");

    await click("[data-test-edit-selected]");

    assert.ok(currentURL().includes("id=1%2C2"));
  });

  test("cannot edit verified reports", async function(assert) {
    const verifier = this.server.create("user");

    this.server.create("report", {
      userId: this.user.id,
      verifiedBy: verifier
    });

    await visit(`/analysis?user=${this.user.id}`);

    await find(".table--analysis tbody tr:last-child").scrollIntoView();
    await click("tbody > tr:last-child");

    assert.notOk(find("tbody > tr:last-child.selected"));
    assert.dom("[data-test-edit-selected]").doesNotExist();
  });
});
