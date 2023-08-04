import { A } from "@ember/array";
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import download from "downloadjs";
import {
  animationFrame,
  dropTask,
  enqueueTask,
  task,
  hash,
} from "ember-concurrency";
import fetch from "fetch";
import moment from "moment";
import parseDjangoDuration from "timed/utils/parse-django-duration";
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
import { cleanParams, toQueryString } from "timed/utils/url";

import config from "../../config/environment";

export default class AnalysisController extends Controller {
  queryParams = [
    "customer",
    "costCenter",
    "project",
    "task",
    "user",
    "reviewer",
    "billingType",
    "costCenter",
    "fromDate",
    "toDate",
    "review",
    "notBillable",
    "verified",
    "billed",
    "ordering",
    "editable",
    "rejected",
  ];

  exportLinks = config.APP.REPORTEXPORTS;
  exportLimit = config.APP.EXPORT_LIMIT;

  @service session;
  @service store;
  @service router;
  @service notify;
  @service can;

  @tracked _scrollOffset = 0;
  @tracked _shouldLoadMore = false;
  @tracked _canLoadMore = true;
  @tracked _lastPage = 0;
  @tracked totalTime = moment.duration();
  @tracked totalItems = A();
  @tracked selectedReportIds = A();
  @tracked _dataCache = A();

  @tracked user;
  @tracked reviewer;
  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked rejected;
  @tracked editable;
  @tracked billingType;
  @tracked fromDate;
  @tracked toDate;
  @tracked review;
  @tracked notBillable;
  @tracked verified;
  @tracked billed;
  @tracked costCenter;
  @tracked ordering = "-date";

  @action
  changeFromDate(date) {
    this.fromDate = serializeMoment(date);
    this._reset();
  }

  get getFromDate() {
    return deserializeMoment(this.fromDate);
  }

  @action
  changeToDate(date) {
    this.toDate = serializeMoment(date);
    this._reset();
  }

  get getToDate() {
    return deserializeMoment(this.toDate);
  }

  @action
  updateParam(key, value) {
    this[key] = value;
    this._reset();
  }

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

  get exportLimitExceeded() {
    return this.totalItems > this.exportLimit;
  }

  get exportLimitMessage() {
    return `The export limit is ${this.exportLimit}. Please use filters to reduce the amount of reports.`;
  }

  get canBill() {
    return (
      this.session.data.user.isAccountant || this.session.data.user.isSuperuser
    );
  }

  _reset() {
    this.data.cancelAll();
    this.loadNext.cancelAll();

    this._lastPage = 0;
    this._canLoadMore = true;
    this._shouldLoadMore = false;
    this._dataCache = A();
    this.selectedReportIds = A();
    this.totalTime = moment.duration();
    this.totalItems = A();

    this.data.perform();
  }

  get appliedFilters() {
    return Object.keys(queryParamsState(this)).filter((key) => {
      return key !== "ordering" && queryParamsState(this)?.[key]?.changed;
    });
  }

  get jwt() {
    return this.session.data.authenticated.access_token;
  }

  @task
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

  @enqueueTask
  *data() {
    const params = underscoreQueryParams(
      serializeQueryParams(allQueryParams(this), queryParamsState(this))
    );

    if (this._canLoadMore) {
      const data = yield this.store.query("report", {
        page: {
          number: this._lastPage + 1,
          size: 20,
        },
        ...params,
        include: "task,task.project,task.project.customer,user",
      });

      const assignees = yield this.fetchAssignees.perform(data);

      const mappedReports = data.map((report) => {
        report.set(
          "taskAssignees",
          assignees.taskAssignees.filter(
            (taskAssignee) =>
              report.get("task.id") === taskAssignee.get("task.id")
          )
        );
        report.set(
          "projectAssignees",
          assignees.projectAssignees.filter(
            (projectAssignee) =>
              report.get("task.project.id") ===
              projectAssignee.get("project.id")
          )
        );
        report.set(
          "customerAssignees",
          assignees.customerAssignees.filter(
            (customerAssignee) =>
              report.get("task.project.customer.id") ===
              customerAssignee.get("customer.id")
          )
        );
        return report;
      });

      this.totalTime = parseDjangoDuration(data.get("meta.total-time"));
      this.totalItems = parseInt(data.get("meta.pagination.count"));
      this._canLoadMore =
        data.get("meta.pagination.pages") !== data.get("meta.pagination.page");
      this._lastPage = data.get("meta.pagination.page");

      this._dataCache.pushObjects(mappedReports.toArray());
    }

    return this._dataCache;
  }

  @task
  *fetchAssignees(data) {
    const projectIds = data
      .map((report) => report.get("task.project.id"))
      .uniq()
      .join(",");
    const taskIds = data
      .map((report) => report.get("task.id"))
      .uniq()
      .join(",");
    const customerIds = data
      .map((report) => report.get("task.project.customer.id"))
      .uniq()
      .join(",");

    const projectAssignees = projectIds.length
      ? yield this.store.query("project-assignee", {
          is_reviewer: 1,
          projects: projectIds,
          include: "project,user",
        })
      : [];
    const taskAssignees = taskIds.length
      ? yield this.store.query("task-assignee", {
          is_reviewer: 1,
          tasks: taskIds,
          include: "task,user",
        })
      : [];
    const customerAssignees = customerIds.length
      ? yield this.store.query("customer-assignee", {
          is_reviewer: 1,
          customers: customerIds,
          include: "customer,user",
        })
      : [];

    return { projectAssignees, taskAssignees, customerAssignees };
  }

  @dropTask
  *loadNext() {
    this._shouldLoadMore = true;

    while (this._shouldLoadMore && this._canLoadMore) {
      yield this.data.perform();

      yield animationFrame();
    }
  }

  @task
  *download(notify, allQueryParams, jwt, { url = null, params = {} }) {
    try {
      this.url = url;
      this.params = params;

      const queryString = toQueryString(
        underscoreQueryParams(
          cleanParams({
            ...params,
            ...serializeQueryParams(allQueryParams, queryParamsState(this)),
          })
        )
      );

      const res = yield fetch(`${url}?${queryString}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const file = yield res.blob();

      // filename      match filename, followed by
      // [^;=\n]*      anything but a ;, a = or a newline
      // =
      // (             first capturing group
      //     (['"])    either single or double quote, put it in capturing group 2
      //     .*?       anything up until the first...
      //     \2        matching quote (single if we found single, double if we find double)
      // |
      //     [^;\n]*   anything but a ; or a newline
      // )
      const filename =
        res.headers
          .get("content-disposition")
          .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g)[0]
          .replace("filename=", "") || "Unknown file";

      // ignore since we can't really test this..
      if (macroCondition(isTesting())) {
        return;
      }
      download(file, filename, file.type);

      notify.success("File was downloaded");
    } catch (e) {
      /* istanbul ignore next */
      notify.error(
        "Error while downloading, try again or try reducing results"
      );
    }
  }

  @action
  edit(selectedIds = [], event) {
    const ids = event ? selectedIds : [];
    this.router.transitionTo("analysis.edit", {
      queryParams: {
        ...(ids && ids.length ? { id: ids } : {}),
        ...serializeQueryParams(allQueryParams(this), queryParamsState(this)),
      },
    });
  }

  @action
  selectRow(report) {
    if (this.can.can("edit report", report) || this.canBill) {
      const selected = this.selectedReportIds;

      if (selected.includes(report.id)) {
        this.selectedReportIds = A([
          ...selected.filter((id) => id !== report.id),
        ]);
      } else {
        this.selectedReportIds = A([...selected, report.id]);
      }
    }
  }

  @action
  setModelFilter(key, value) {
    this[key] = value && value.id;
    this._reset();
  }

  @action
  reset() {
    resetQueryParams(
      this,
      Object.keys(allQueryParams(this)).filter((k) => k !== "ordering")
    );
  }

  get allQueryParams() {
    return allQueryParams(this);
  }
}
