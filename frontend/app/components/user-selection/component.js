import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { restartableTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import customOptionTemplate from "timed/components/optimized-power-select/custom-options/user-option";
import customSelectedTemplate from "timed/components/optimized-power-select/custom-select/user-selection";

export default class UserSelection extends Component {
  selectedTemplate = customSelectedTemplate;
  optionTemplate = customOptionTemplate;

  @service tracking;
  @service store;

  @tracked queryOptions = null;

  constructor(...args) {
    super(...args);
    this.tracking.users.perform();
  }

  @restartableTask
  *usersTask() {
    // this yield is here 'cause we are modifying the store
    yield Promise.resolve();
    yield this.tracking.users.last;

    const queryOptions = this.queryOptions || {};

    queryOptions.ordering = "username";
    return yield this.store.query("user", queryOptions);
  }

  _users = trackedTask(this, this.usersTask, () => [
    this.tracking.users,
    this.queryOptions,
  ]);

  get users() {
    return this._users.value ?? [];
  }
}
