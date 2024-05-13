import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout, hash } from "ember-concurrency";
import { task as trackedTask } from "ember-resources/util/ember-concurrency";
import moment from "moment";
import QPController from "timed/controllers/qpcontroller";

export default class UsersIndexController extends QPController {
  queryParams = ["search", "supervisor", "active", "ordering"];

  @service currentUser;
  @service router;
  @service store;

  @tracked search = "";
  @tracked supervisor = null;
  @tracked active = "1";
  @tracked ordering = "username";

  constructor(...args) {
    super(...args);

    this.prefetchData.perform();
  }

  _fetchData = trackedTask(this, this.data, () => [
    this.supervisor,
    this.search,
    this.ordering,
    this.active,
  ]);

  get selectedSupervisor() {
    return this.supervisor && this.store.peekRecord("user", this.supervisor);
  }

  get fetchData() {
    return this._fetchData ?? {};
  }

  @restartableTask
  *resetFilter() {
    yield this.resetQueryParams();
  }

  @action
  viewUserProfile(userId) {
    return this.router.transitionTo("users.edit", userId);
  }

  @restartableTask
  *prefetchData() {
    const supervisorId = this.supervisor;

    return yield hash({
      supervisor: supervisorId && this.store.findRecord("user", supervisorId),
    });
  }

  @restartableTask
  *data() {
    yield Promise.resolve();
    const date = moment().format("YYYY-MM-DD");

    yield this.store.query("employment", { date });
    yield this.store.query("worktime-balance", { date });

    return yield this.store.query("user", {
      ...this.allQueryParams,
      ...(this.currentUser.user.isSuperuser
        ? {}
        : {
            supervisor: this.currentUser.user.id,
          }),
    });
  }

  @restartableTask
  *setSearchFilter(value) {
    yield timeout(500);

    this.search = value;
  }

  @restartableTask
  *setModelFilter(key, value) {
    yield set(this, key, value && value.id);
  }
}
