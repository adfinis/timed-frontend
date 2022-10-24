import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task, timeout, hash } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";

const UsersQueryParams = new QueryParams({
  search: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  supervisor: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  active: {
    defaultValue: "1",
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: "username",
    replace: true,
    refresh: true
  }
});

const UsersIndexController = Controller.extend(UsersQueryParams.Mixin, {
  session: service("session"),

  currentUser: reads("session.data.user"),

  selectedSupervisor: computed(
    "supervisor",
    "prefetchData.lastSuccessful.value.supervisor",
    function() {
      return this.supervisor && this.store.peekRecord("user", this.supervisor);
    }
  ),

  setup() {
    this.prefetchData.perform();
    this.data.perform();
  },

  reset() {
    /* istanbul ignore next */
    this.resetQueryParams();
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.data.perform();
    }
  },

  prefetchData: task(function*() {
    const supervisorId = this.supervisor;

    return yield hash({
      supervisor: supervisorId && this.store.findRecord("user", supervisorId)
    });
  }).restartable(),

  data: task(function*() {
    const date = moment().format("YYYY-MM-DD");

    yield this.store.query("employment", { date });
    yield this.store.query("worktime-balance", { date });

    return yield this.store.query("user", {
      ...this.allQueryParams,
      ...(this.get("currentUser.isSuperuser")
        ? {}
        : {
            supervisor: this.get("currentUser.id")
          })
    });
  }).restartable(),

  setSearchFilter: task(function*(value) {
    yield timeout(500);

    this.set("search", value);
  }).restartable(),

  setModelFilter: task(function*(key, value) {
    yield this.set(key, value && value.id);
  }),

  resetFilter: task(function*() {
    yield this.resetQueryParams();
  })
});

export default UsersIndexController;
