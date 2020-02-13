import EmberObject from "@ember/object";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

const WorktimeBalance = EmberObject.extend({
  balance: moment.duration({ h: 10 })
});

module("Unit | Component | worktime balance chart", function(hooks) {
  setupRenderingTest(hooks);

  test("computes the data correctly", function(assert) {
    const dates = [...new Array(3).keys()].map(i =>
      moment().subtract(i, "days")
    );

    const component = this.owner.lookup("component:worktime-balance-chart");
    component.set(
      "worktimeBalances",
      dates.map(date => WorktimeBalance.create({ date }))
    );

    assert.deepEqual(
      component.get("data.labels").map(l => l.format("YYYY-MM-DD")),
      dates.map(d => d.format("YYYY-MM-DD"))
    );

    assert.deepEqual(component.get("data.datasets"), [{ data: [10, 10, 10] }]);
  });

  test("computes tooltip correctly", function(assert) {
    const component = this.owner.lookup("component:worktime-balance-chart");

    const titleFn = component.get("options.tooltips.callbacks.title");
    const labelFn = component.get("options.tooltips.callbacks.label");

    assert.equal(
      titleFn([{ index: 0 }], { labels: [moment()] }),
      moment().format("DD.MM.YYYY")
    );
    assert.equal(labelFn({ yLabel: 10.5 }), "10h 30m");
  });
});
