import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import moment from "moment";
import { all } from "rsvp";

export default class UsersEditResponsibilitiesController extends Controller {
  @service router;
  @service store;

  @action
  openSupervisorProfile(superviseId) {
    return this.router.transitionTo("users.edit", superviseId);
  }

  @task
  *projects() {
    return yield this.store.query("project", {
      has_reviewer: this.user?.id,
      include: "customer",
      ordering: "customer__name,name",
    });
  }

  @task
  *supervisees() {
    const supervisor = this.user?.id;

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
  }
}
