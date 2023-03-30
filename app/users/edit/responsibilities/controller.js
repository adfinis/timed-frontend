import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";
import { all } from "rsvp";

const UsersEditResponsibilitiesQueryParams = new QueryParams({});

export default Controller.extend(UsersEditResponsibilitiesQueryParams.Mixin, {
  router: service("router"),

  setup() {
    this.projects.perform();
    this.supervisees.perform();
  },

  openSuperviseProfile: task(function* (superviseId) {
    yield this.router.transitionTo("users.edit", superviseId);
  }),

  projects: task(function* () {
    return yield this.store.query("project", {
      has_reviewer: this.get("model.id"),
      include: "customer",
      ordering: "customer__name,name",
    });
  }),

  supervisees: task(function* () {
    const supervisor = this.get("model.id");

    const balances = yield this.store.query("worktime-balance", {
      supervisor,
      date: moment().format("YYYY-MM-DD"),
      include: "user",
    });

    return yield all(
      balances
        .mapBy("user")
        .filterBy("isActive")
        .map(async (user) => {
          const absenceBalances = await this.store.query("absence-balance", {
            date: moment().format("YYYY-MM-DD"),
            user: user.get("id"),
            absence_type: 2,
          });

          user.set("absenceBalances", absenceBalances);

          return user;
        })
    );
  }),
});
