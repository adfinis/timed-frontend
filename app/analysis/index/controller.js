import { A } from "@ember/array";
import Controller from "@ember/controller";
import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import download from "downloadjs";
import { dropTask, enqueueTask, task, hash } from "ember-concurrency";
import QueryParams from "ember-parachute";
import fetch from "fetch";
import moment from "moment";
import { Promise } from "rsvp";
import parseDjangoDuration from "timed/utils/parse-django-duration";
import {
  underscoreQueryParams,
  serializeParachuteQueryParams,
} from "timed/utils/query-params";
import { cleanParams, toQueryString } from "timed/utils/url";

import config from "../../config/environment";

const rAF = () => {
  return new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
};

const DATE_FORMAT = "YYYY-MM-DD";

const serializeMoment = (momentObject) =>
  (moment.isMoment(momentObject) && momentObject.format(DATE_FORMAT)) || null;

const deserializeMoment = (momentString) =>
  (momentString && moment(momentString, DATE_FORMAT)) || null;

export const AnalysisQueryParams = new QueryParams({
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
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  notBillable: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  verified: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  editable: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  billed: {
    defaultValue: undefined,
    replace: true,
    refresh: true,
  },
  // We serialize the ordering as null if the
  // value equals the defaultValue. For some reason
  // if the serialized value is not null we had some
  // weird query param behavior where the ordering
  // param was set to the defaultValue when editing
  // a report and due to that all other queryParams
  // where reset.
  ordering: {
    defaultValue: "-date",
    replace: true,
    refresh: true,
    serialize(val) {
      return val === "-date" ? null : `${val},id`;
    },
    deserialize(val) {
      return val === null ? "-date" : val.replace(",id", "");
    },
  },
});

export default class AnalysisController extends Controller.extend(
  AnalysisQueryParams.Mixin
) {
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
  @tracked selectedReportIds;

  setup() {
    this._dataCache = A();
    this.selectedReportIds = A();

    this.prefetchData.perform();

    if (!this.skipResetOnSetup) {
      this._reset();
    }
  }

  _reset() {
    this.data.cancelAll();
    this.loadNext.cancelAll();

    this._lastPage = 0;
    this._canLoadMore = true;
    this._shouldLoadMore = false;
    this._dataCache = A();
    this.selectedReportIds = A();

    this.data.perform();
  }

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this._reset();
    }
  }

  get appliedFilters() {
    return Object.keys(this.queryParamsState).filter((key) => {
      return key !== "ordering" && this.queryParamsState?.[key]?.changed;
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

  @enqueueTask
  *data() {
    const params = underscoreQueryParams(
      serializeParachuteQueryParams(this.allQueryParams, AnalysisQueryParams)
    );

    if (this._canLoadMore) {
      const data = yield this.store.query("report", {
        page: {
          number: this._canLoadMore ? this._lastPage + 1 : this._lastPage,
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

      yield rAF();
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
            ...serializeParachuteQueryParams(
              allQueryParams,
              AnalysisQueryParams
            ),
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
        res.headers.map["content-disposition"]
          .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g)[0]
          .replace("filename=", "") || "Unknown file";

      // ignore since we can't really test this..
      if (macroCondition(isTesting())) {
        return;
      }
      download(file, filename, file.type);

      notify.success("File was downloaded");
    } catch (e) {
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
        ...this.allQueryParams,
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
    set(this, key, value && value.id);
  }

  @action
  reset() {
    this.resetQueryParams(
      Object.keys(this.allQueryParams).filter((k) => k !== "ordering")
    );
  }
}
