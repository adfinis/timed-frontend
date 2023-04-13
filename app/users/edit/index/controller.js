import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import moment from "moment";

export default class EditUser extends Controller {
  @service store;

  constructor(...args) {
    super(...args);
    this.absences.perform();
    this.employments.perform();
  }

  @task
  *absences() {
    return yield this.store.query("absence", {
      user: this.model?.id,
      ordering: "-date",
      // eslint-disable-next-line camelcase
      from_date: moment({
        day: 1,
        month: 0,
        year: this.year,
      }).format("YYYY-MM-DD"),
      include: "absence_type",
    });
  }

  @task
  *employments() {
    return yield this.store.query("employment", {
      user: this.model?.id,
      ordering: "-start_date",
      include: "location",
    });
  }
}
