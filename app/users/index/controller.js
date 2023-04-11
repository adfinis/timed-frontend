import Controller from "@ember/controller";
import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout, hash } from "ember-concurrency";
import { task as trackedTask } from "ember-resources/util/ember-concurrency";
import moment from "moment";

export default class UsersIndexController extends Controller {
  queryParams = ["search", "supervisor", "active", "ordering"];
  @service session;
  @service router;
  @service store;
  @tracked currentUser = this.session.data.user;
  @tracked search = "";
  @tracked supervisor = null;
  @tracked active = "1";
  @tracked ordering = "username";

  constructor(...args) {
    super(...args);
    this.prefetchData.perform();
  }

  _fetchData = trackedTask(this, this.data, () => {
    return [this.supervisor, this.search, this.ordering, this.active];
  });

  get selectedSupervisor() {
    return this.supervisor && this.store.peekRecord("user", this.supervisor);
  }

  get fetchData() {
    return this._fetchData ?? {};
  }

  get allQueryParams() {
    return {
      supervisor: this.supervisor,
      search: this.search,
      active: this.active,
      ordering: this.ordering,
    };
  }

  resetQueryParams() {
    this.search = "";
    this.supervisor = null;
    this.active = "1";
    this.ordering = "username";
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
      ...(this.currentUser.isSuperuser
        ? {}
        : {
            supervisor: this.currentUser.id,
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
