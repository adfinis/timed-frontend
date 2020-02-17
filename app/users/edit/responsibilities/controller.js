import Controller from "@ember/controller";
import { task } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";

const UsersEditResponsibilitiesQueryParams = new QueryParams({});

export default Controller.extend(UsersEditResponsibilitiesQueryParams.Mixin, {
  setup() {
    this.get("projects").perform();
    this.get("supervisees").perform();
  },

  projects: task(function*() {
    return yield this.store.query("project", {
      reviewer: this.get("model.id"),
      include: "customer",
      ordering: "customer__name,name"
    });
  }),

  supervisees: task(function*() {
    const supervisor = this.get("model.id");

    const balances = yield this.store.query("worktime-balance", {
      supervisor,
      date: moment().format("YYYY-MM-DD"),
      include: "user"
    });

    return balances.mapBy("user").filterBy("isActive");
  })
});
