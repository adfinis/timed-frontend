import { A } from "@ember/array";
import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import download from "downloadjs";
import Ember from "ember";
import { task, hash } from "ember-concurrency";
import QueryParams from "ember-parachute";
import fetch from "fetch";
import moment from "moment";
import { Promise } from "rsvp";
import parseDjangoDuration from "timed/utils/parse-django-duration";
import {
  underscoreQueryParams,
  serializeParachuteQueryParams
} from "timed/utils/query-params";
import { cleanParams, toQueryString } from "timed/utils/url";

import config from "../../config/environment";

const rAF = () => {
  return new Promise(resolve => {
    window.requestAnimationFrame(resolve);
  });
};

const DATE_FORMAT = "YYYY-MM-DD";

const serializeMoment = momentObject =>
  (moment.isMoment(momentObject) && momentObject.format(DATE_FORMAT)) || null;

const deserializeMoment = momentString =>
  (momentString && moment(momentString, DATE_FORMAT)) || null;

export const AnalysisQueryParams = new QueryParams({
  customer: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  project: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  task: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  user: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  reviewer: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  billingType: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  costCenter: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  fromDate: {
    defaultValue: null,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment
  },
  toDate: {
    defaultValue: null,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment
  },
  review: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  notBillable: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  verified: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  editable: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  billed: {
    defaultValue: "",
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: "-date",
    replace: true,
    refresh: true,
    serialize(val) {
      return `${val},id`;
    },
    deserialize(val) {
      return val.replace(",id", "");
    }
  }
});

const AnalysisController = Controller.extend(AnalysisQueryParams.Mixin, {
  billingTypes: computed(
    "prefetchData.lastSuccessful.value.billingTypes",
    function() {
      return this.store.findAll("billing-type");
    }
  ),

  costCenters: computed(
    "prefetchData.lastSuccessful.value.costCenters",
    function() {
      return this.store.findAll("cost-center");
    }
  ),

  selectedCustomer: computed(
    "customer",
    "prefetchData.lastSuccessful.value.customer",
    function() {
      return this.customer && this.store.peekRecord("customer", this.customer);
    }
  ),

  selectedProject: computed(
    "project",
    "prefetchData.lastSuccessful.value.project",
    function() {
      return this.project && this.store.peekRecord("project", this.project);
    }
  ),

  selectedTask: computed(
    "task",
    "prefetchData.lastSuccessful.value.task",
    function() {
      return this.task && this.store.peekRecord("task", this.task);
    }
  ),

  selectedUser: computed(
    "user",
    "prefetchData.lastSuccessful.value.user",
    function() {
      return this.user && this.store.peekRecord("user", this.user);
    }
  ),

  selectedReviewer: computed(
    "reviewer",
    "prefetchData.lastSuccessful.value.reviewer",
    function() {
      return this.reviewer && this.store.peekRecord("user", this.reviewer);
    }
  ),

  exportLimitExceeded: computed("totalItems", function() {
    return this.totalItems > this.exportLimit;
  }),

  exportLimitMessage: computed("exportLimit", function() {
    return `The export limit is ${this.exportLimit}. Please use filters to reduce the amount of reports.`;
  }),

  canBill: computed("session.data.user", function() {
    return (
      this.session.data.user.isAccountant || this.session.data.user.isSuperuser
    );
  }),

  exportLinks: config.APP.REPORTEXPORTS,

  exportLimit: config.APP.EXPORT_LIMIT,

  session: service("session"),

  notify: service("notify"),

  can: service("can"),

  jwt: reads("session.data.authenticated.access_token"),

  _scrollOffset: 0,

  init(...args) {
    this._super(...args);

    this.set("_dataCache", A());
    this.set("selectedReportIds", A());
  },

  setup() {
    this.prefetchData.perform();

    if (!this.skipResetOnSetup) {
      this._reset();
    }
  },

  _reset() {
    this.data.cancelAll();
    this.loadNext.cancelAll();

    this.setProperties({
      _lastPage: 0,
      _canLoadMore: true,
      _shouldLoadMore: false,
      _dataCache: A(),
      selectedReportIds: A()
    });

    this.data.perform();
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this._reset();
    }
  },

  _shouldLoadMore: false,
  _canLoadMore: true,
  _lastPage: 0,

  appliedFilters: computed("queryParamsState", function() {
    return Object.keys(this.queryParamsState).filter(key => {
      return key !== "ordering" && this.get(`queryParamsState.${key}.changed`);
    });
  }),

  prefetchData: task(function*() {
    const {
      customer: customerId,
      project: projectId,
      task: taskId,
      user: userId,
      reviewer: reviewerId
    } = this.allQueryParams;

    return yield hash({
      customer: customerId && this.store.findRecord("customer", customerId),
      project: projectId && this.store.findRecord("project", projectId),
      task: taskId && this.store.findRecord("task", taskId),
      user: userId && this.store.findRecord("user", userId),
      reviewer: reviewerId && this.store.findRecord("user", reviewerId),
      billingTypes: this.store.findAll("billing-type"),
      costCenters: this.store.findAll("cost-center")
    });
  }),

  data: task(function*() {
    const params = underscoreQueryParams(
      serializeParachuteQueryParams(this.allQueryParams, AnalysisQueryParams)
    );

    const data = yield this.store.query("report", {
      page: {
        number: this._lastPage + 1,
        size: 20
      },
      ...params,
      include: "task,task.project,task.project.customer,user"
    });

    const assignees = yield this.fetchAssignees.perform(data);

    const mappedReports = data.map(report => {
      report.set(
        "taskAssignees",
        assignees.taskAssignees.filter(
          taskAssignee => report.get("task.id") === taskAssignee.get("task.id")
        )
      );
      report.set(
        "projectAssignees",
        assignees.projectAssignees.filter(
          projectAssignee =>
            report.get("task.project.id") === projectAssignee.get("project.id")
        )
      );
      report.set(
        "customerAssignees",
        assignees.customerAssignees.filter(
          customerAssignee =>
            report.get("task.project.customer.id") ===
            customerAssignee.get("customer.id")
        )
      );
      return report;
    });

    this.setProperties({
      totalTime: parseDjangoDuration(data.get("meta.total-time")),
      totalItems: parseInt(data.get("meta.pagination.count")),
      _canLoadMore:
        data.get("meta.pagination.pages") !== data.get("meta.pagination.page"),
      _lastPage: data.get("meta.pagination.page")
    });

    this._dataCache.pushObjects(mappedReports.toArray());

    return this._dataCache;
  }).enqueue(),

  fetchAssignees: task(function*(data) {
    const projectIds = data
      .map(report => report.get("task.project.id"))
      .uniq()
      .join(",");
    const taskIds = data
      .map(report => report.get("task.id"))
      .uniq()
      .join(",");
    const customerIds = data
      .map(report => report.get("task.project.customer.id"))
      .uniq()
      .join(",");

    const projectAssignees = projectIds.length
      ? yield this.store.query("project-assignee", {
          is_reviewer: 1,
          projects: projectIds,
          include: "project,user"
        })
      : [];
    const taskAssignees = taskIds.length
      ? yield this.store.query("task-assignee", {
          is_reviewer: 1,
          tasks: taskIds,
          include: "task,user"
        })
      : [];
    const customerAssignees = customerIds.length
      ? yield this.store.query("customer-assignee", {
          is_reviewer: 1,
          customers: customerIds,
          include: "customer,user"
        })
      : [];

    return { projectAssignees, taskAssignees, customerAssignees };
  }),

  loadNext: task(function*() {
    this.set("_shouldLoadMore", true);

    while (this._shouldLoadMore && this._canLoadMore) {
      yield this.data.perform();

      yield rAF();
    }
  }).drop(),

  download: task({
    url: null,
    params: {},

    *perform(notify, allQueryParams, jwt, { url, params }) {
      try {
        this.setProperties({ url, params });

        const queryString = toQueryString(
          underscoreQueryParams(
            cleanParams({
              ...params,
              ...serializeParachuteQueryParams(
                allQueryParams,
                AnalysisQueryParams
              )
            })
          )
        );

        const res = yield fetch(`${url}?${queryString}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });

        /* istanbul ignore next */
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
        /* istanbul ignore next */
        if (!Ember.testing) {
          download(file, filename, file.type);
        }

        notify.success("File was downloaded");
      } catch (e) {
        /* istanbul ignore next */
        notify.error(
          "Error while downloading, try again or try reducing results"
        );
      }
    }
  }),

  actions: {
    edit(ids = []) {
      this.transitionToRoute("analysis.edit", {
        queryParams: {
          id: ids,
          ...this.allQueryParams
        }
      });
    },

    selectRow(report) {
      if (this.can.can("edit report", report) || this.canBill) {
        const selected = this.selectedReportIds;

        if (selected.includes(report.id)) {
          this.set(
            "selectedReportIds",
            A([...selected.filter(id => id !== report.id)])
          );
        } else {
          this.set("selectedReportIds", A([...selected, report.id]));
        }
      }
    },

    setModelFilter(key, value) {
      this.set(key, value && value.id);
    },

    reset() {
      this.resetQueryParams(
        Object.keys(this.allQueryParams).filter(k => k !== "ordering")
      );
    }
  }
});

export default AnalysisController;
