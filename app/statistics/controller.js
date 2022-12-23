import Controller from "@ember/controller";
import { action, get, set } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { restartableTask, hash } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";
import {
  underscoreQueryParams,
  serializeParachuteQueryParams,
} from "timed/utils/query-params";

const DATE_FORMAT = "YYYY-MM-DD";

const serializeMoment = (momentObject) =>
  (momentObject && momentObject.format(DATE_FORMAT)) || null;

const deserializeMoment = (momentString) =>
  (momentString && moment(momentString, DATE_FORMAT)) || null;

const TYPES = {
  year: { include: "", requiredParams: [] },
  month: { include: "", requiredParams: [] },
  customer: { include: "customer", requiredParams: [] },
  project: {
    include: "project,project.customer",
    requiredParams: ["customer"],
  },
  task: {
    include: "task,task.project,task.project.customer",
    requiredParams: ["customer", "project"],
  },
  user: { include: "user", requiredParams: [] },
};

export const StatisticsQueryParams = new QueryParams({
  customer: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  project: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  task: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  user: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  reviewer: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  billingType: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  costCenter: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  fromDate: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment,
  },
  toDate: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment,
  },
  review: {
    defaultValue: "",
    replace: true,
    refresh: true,
  },
  notBillable: {
    defaultValue: "",
    replace: true,
    refresh: true,
  },
  verified: {
    defaultValue: "",
    replace: true,
    refresh: true,
  },
  billed: {
    defaultValue: "",
    replace: true,
    refresh: true,
  },
  type: {
    defaultValue: Object.keys(TYPES)[0],
    replace: true,
    refresh: true,
  },
  ordering: {
    defaultValue: "",
    replace: true,
    refresh: true,
  },
});

export default class StatisticsController extends Controller.extend(
  StatisticsQueryParams.Mixin
) {
  types = Object.keys(TYPES);

  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked user;
  @tracked reviewer;
  @tracked type = Object.keys(TYPES)[0];
  @tracked observed;

  get billingTypes() {
    return this.store.findAll("billing-type");
  }

  get costCenters() {
    return this.store.findAll("cost-center");
  }

  get selectedCustomer() {
    return this.customer && this.store.peekRecord("customer", this.customer);
  }

  get selectedProject() {
    return this.project && this.store.peekRecord("project", this.project);
  }

  get selectedTask() {
    return this.task && this.store.peekRecord("task", this.task);
  }

  get selectedUser() {
    return this.user && this.store.peekRecord("user", this.user);
  }

  get selectedReviewer() {
    return this.reviewer && this.store.peekRecord("user", this.reviewer);
  }

  get missingParams() {
    return this.requiredParams.filter(
      (param) => !this.queryParamsState[param].changed
    );
  }

  setup() {
    const observed = Object.keys(TYPES).reduce((set, key) => {
      return [
        ...set,
        ...get(TYPES, `${key}.requiredParams`).filter((p) => !set.includes(p)),
      ];
    }, []);
    this.observed = observed.join(",");

    this.prefetchData.perform();
    this.data.perform();
  }

  reset(_, isExiting) {
    /* istanbul ignore next */
    if (isExiting) {
      this.resetQueryParams();
    }
  }

  queryParamsDidChange({ shouldRefresh, changed }) {
    if (shouldRefresh) {
      this.data.perform();
    }

    if (Object.keys(changed).includes("type")) {
      this.resetQueryParams("ordering");
    }
  }

  get appliedFilters() {
    return Object.keys(this.queryParamsState).filter((key) => {
      return this.queryParamsState[key]?.changed && key !== "type";
    });
  }

  get requiredParams() {
    return TYPES[this.type].requiredParams;
  }

  @restartableTask
  *prefetchData() {
    const {
      customer: customerId,
      project: projectId,
      task: taskId,
      user: userId,
      reviewer: reviewerId,
    } = this.allQueryParams;

    return yield hash({
      customer: customerId && this.store.findRecord("customer", customerId),
      project: projectId && this.store.findRecord("project", projectId),
      task: taskId && this.store.findRecord("task", taskId),
      user: userId && this.store.findRecord("user", userId),
      reviewer: reviewerId && this.store.findRecord("user", reviewerId),
      billingTypes: this.store.findAll("billing-type"),
      costCenters: this.store.findAll("cost-center"),
    });
  }

  @restartableTask
  *data() {
    if (this.missingParams.length) {
      return null;
    }

    const type = this.type;

    let params = underscoreQueryParams(
      serializeParachuteQueryParams(this.allQueryParams, StatisticsQueryParams)
    );

    params = Object.keys(params).reduce((obj, key) => {
      return key !== "type" ? { ...obj, [key]: get(params, key) } : obj;
    }, {});

    return yield this.store.query(`${type}-statistic`, {
      include: TYPES[type].include,
      ...params,
    });
  }

  @action
  setModelFilter(key, value) {
    set(this, key, value && value.id);
  }

  @action
  resetQP() {
    this.resetQueryParams(
      Object.keys(this.allQueryParams).filter((qp) => qp !== "type")
    );
  }
}
