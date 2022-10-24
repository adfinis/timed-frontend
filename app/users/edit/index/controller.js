import Controller from "@ember/controller";
import { task } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";

const UsersEditIndexQueryParams = new QueryParams({});

export default Controller.extend(UsersEditIndexQueryParams.Mixin, {
  setup() {
    this.absences.perform();
    this.employments.perform();
  },

  absences: task(function*() {
    return yield this.store.query("absence", {
      user: this.get("model.id"),
      ordering: "-date",
      // eslint-disable-next-line camelcase
      from_date: moment({
        day: 1,
        month: 0,
        year: this.year
      }).format("YYYY-MM-DD"),
      include: "absence_type"
    });
  }),

  employments: task(function*() {
    return yield this.store.query("employment", {
      user: this.get("model.id"),
      ordering: "-start_date",
      include: "location"
    });
  })
});
