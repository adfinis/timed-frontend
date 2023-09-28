import Controller from "@ember/controller";
import { action, get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, hash } from "ember-concurrency";
import {
  underscoreQueryParams,
  serializeQueryParams,
  resetQueryParams,
  allQueryParams,
  queryParamsState,
} from "timed/utils/query-params";
import {
  serializeMoment,
  deserializeMoment,
} from "timed/utils/serialize-moment";

const TYPES = {
  year: { include: "", requiredParams: [] },
  month: { include: "", requiredParams: [] },
  customer: { include: "", requiredParams: ["fromDate"] },
  project: {
    include: "customer",
    requiredParams: ["customer"],
  },
  task: {
    include: "project,project.customer",
    requiredParams: ["customer", "project"],
  },
  user: { include: "user", requiredParams: [] },
};

export default class StatisticsController extends Controller {
  types = Object.keys(TYPES);

  queryParams = [
    "customer",
    "project",
    "task",
    "user",
    "reviewer",
    "billingType",
    "costCenter",
    "fromDate",
    "toDate",
    "type",
    "review",
    "notBillable",
    "verified",
    "billed",
    "ordering",
  ];

  @service store;
  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked user;
  @tracked reviewer;
  @tracked type = this.types[0];
  @tracked observed;
  @tracked billingType;
  @tracked costCenter;
  @tracked fromDate;
  @tracked toDate;
  @tracked review;
  @tracked notBillable;
  @tracked verified;
  @tracked billed;
  @tracked ordering;

  @action
  updateParam(key, value) {
    this[key] = value;
    this.data.perform();
  }

  get billingTypes() {
    return this.store.findAll("billing-type");
  }

  get costCenters() {
    return this.store.findAll("cost-center");
  }

  get selectedCustomer() {
    return (
      this.customer &&
      !this.prefetchData.isRunning &&
      this.store.peekRecord("customer", this.customer)
    );
  }

  get selectedProject() {
    return (
      this.project &&
      !this.prefetchData.isRunning &&
      this.store.peekRecord("project", this.project)
    );
  }

  get selectedTask() {
    return (
      this.task &&
      !this.prefetchData.isRunning &&
      this.store.peekRecord("task", this.task)
    );
  }

  get selectedUser() {
    return (
      this.user &&
      !this.prefetchData.isRunning &&
      this.store.peekRecord("user", this.user)
    );
  }

  get selectedReviewer() {
    return (
      this.reviewer &&
      !this.prefetchData.isRunning &&
      this.store.peekRecord("user", this.reviewer)
    );
  }

  get missingParams() {
    return this.requiredParams.filter(
      (param) => !queryParamsState(this)[param].changed
    );
  }

  get appliedFilters() {
    return Object.keys(queryParamsState(this)).filter((key) => {
      return queryParamsState(this)[key]?.changed && key !== "type";
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
    } = allQueryParams(this);

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
      serializeQueryParams(allQueryParams(this), queryParamsState(this))
    );

    params = Object.keys(params).reduce((obj, key) => {
      return key !== "type" ? { ...obj, [key]: get(params, key) } : obj;
    }, {});

    return yield this.store.query(`${type}-statistic`, {
      include: TYPES[type].include,
      ...params,
    });
  }

  get getFromDate() {
    return deserializeMoment(this.fromDate);
  }

  get getToDate() {
    return deserializeMoment(this.toDate);
  }

  @action
  setModelFilter(key, value) {
    if (["fromDate", "toDate"].includes(key)) {
      set(this, key, serializeMoment(value));
    } else {
      set(this, key, value && value.id);
    }
    this.data.perform();
  }

  @action
  resetQP() {
    resetQueryParams(
      this,
      Object.keys(allQueryParams(this)).filter((qp) => qp !== "type")
    );
  }
}
