import Controller from "@ember/controller";
import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout, hash } from "ember-concurrency";

export default class UsersIndexController extends Controller {
  queryParams = ["search", "supervisor", "active", "ordering"];
  @service session;
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

  get selectedSupervisor() {
    return this.supervisor && this.store.peekRecord("user", this.supervisor);
  }

  get currentUser() {
    return this.session.data.user;
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
  *setSearchFilter(value) {
    yield timeout(500);

    this.search = value;
  }

  @restartableTask
  *setModelFilter(key, value) {
    yield set(this, key, value && value.id);
  }
}
