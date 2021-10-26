import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Ability | report", function(hooks) {
  setupTest(hooks);

  test("can edit when user is superuser", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { isSuperuser: true });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user is accountant", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { isAccountant: true });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user is accountant and report is verified", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { isAccountant: true });
    ability.set("model", { verifiedBy: { id: 1 } });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user is superuser and report is verified", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { isSuperuser: true });
    ability.set("model", { verifiedBy: { id: 1 } });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user owns report", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { id: 1 });
    ability.set("model", { user: { id: 1 } });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user is supervisor of owner", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { id: 1 });
    ability.set("model", { user: { supervisors: [{ id: 1 }] } });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can edit when user reviewer of project", function(assert) {
    const ability = this.owner.lookup("ability:report");
    const user = { id: 1 };
    const projectAssignee = [{ user }];
    ability.set("user", user);
    ability.set("model", {
      projectAssignees: projectAssignee
    });

    assert.equal(ability.get("canEdit"), true);
  });

  test("can not edit when not allowed", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { id: 1, isSuperuser: false });
    ability.set("model", {
      user: { id: 2, supervisors: [{ id: 2 }] },
      task: { project: { reviewers: [{ id: 2 }] } },
      projectAssignees: [{ id: 2 }]
    });

    assert.equal(ability.get("canEdit"), false);
  });

  test("can not edit when report is verified and billed", function(assert) {
    const ability = this.owner.lookup("ability:report");
    ability.set("user", { id: 1, isSuperuser: false });
    ability.set("model", {
      user: { id: 1, supervisors: [{ id: 1 }] },
      projectAssignees: [{ id: 1 }],
      verifiedBy: { id: 1 },
      billed: true
    });

    assert.equal(ability.get("canEdit"), false);
  });
});
