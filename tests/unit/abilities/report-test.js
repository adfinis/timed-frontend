import EmberObject from "@ember/object";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";
import setupSession from "timed/tests/helpers/session-mock";

module("Unit | Ability | report", function (hooks) {
  setupTest(hooks);
  setupSession(hooks);

  test("can edit when user is superuser", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ isSuperuser: true }) };

    assert.true(ability.get("canEdit"));
  });

  test("can edit when user is superuser and report is verified", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ isSuperuser: true }) };
    ability.set("model", { verifiedBy: EmberObject.create({ id: 1 }) });

    assert.true(ability.get("canEdit"));
  });

  test("can edit when user owns report", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ id: 1 }) };
    ability.set("model", { user: EmberObject.create({ id: 1 }) });

    assert.true(ability.get("canEdit"));
  });

  test("can edit when user is supervisor of owner", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ id: 1 }) };
    ability.set("model", {
      user: EmberObject.create({ supervisors: [{ id: 1 }] }),
    });

    assert.true(ability.get("canEdit"));
  });

  test("can edit when user reviewer of project", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const user = EmberObject.create({ id: 1 });
    const projectAssignee = [{ user }];
    const session = this.owner.lookup("service:session");
    session.data = { user };
    ability.set(
      "model",
      EmberObject.create({
        projectAssignees: projectAssignee,
      })
    );

    assert.true(ability.get("canEdit"));
  });

  test("can not edit when not allowed", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ id: 1, isSuperuser: false }) };
    ability.set("model", {
      user: EmberObject.create({ id: 2, supervisors: [{ id: 2 }] }),
      task: { project: { reviewers: [{ id: 2 }] } },
      projectAssignees: [{ id: 2 }],
    });

    assert.false(ability.get("canEdit"));
  });

  test("can not edit when report is verified and billed", function (assert) {
    const ability = this.owner.lookup("ability:report");
    const session = this.owner.lookup("service:session");
    session.data = { user: EmberObject.create({ id: 1, isSuperuser: false }) };
    ability.set("model", {
      user: EmberObject.create({ id: 1, supervisors: [{ id: 1 }] }),
      projectAssignees: [{ id: 1 }],
      verifiedBy: EmberObject.create({ id: 1 }),
      billed: true,
    });

    assert.false(ability.get("canEdit"));
  });
});
