import { getOwner } from "@ember/application";
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import {
  underscoreQueryParams,
  serializeQueryParams,
  filterQueryParams,
  getDefaultQueryParamValue,
  allQueryParams,
} from "timed/utils/query-params";
import {
  serializeMoment,
  deserializeMoment,
} from "timed/utils/serialize-moment";
import { cleanParams, toQueryString } from "timed/utils/url";
import IntersectionValidations from "timed/validations/intersection";

const filterUnchanged = (attributes, changes) => {
  return Object.keys(attributes).reduce((obj, attr) => {
    return changes.map(({ key }) => dasherize(key)).includes(attr)
      ? { ...obj, [attr]: attributes[attr] }
      : obj;
  }, {});
};

const TOOLTIP_CANNOT_VERIFY =
  "Please select yourself as 'reviewer' to verify reports.";
const TOOLTIP_NEEDS_REVIEW = "Please review selected reports before verifying.";

export default class AnalysisEditController extends Controller {
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
    "id",
  ];

  IntersectionValidations = IntersectionValidations;

  @service notify;
  @service router;
  @service fetch;
  @service session;
  @service store;
  @service unverifiedReports;

  @tracked id;
  @tracked user;
  @tracked reviewer;
  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked billingType;
  @tracked costCenter;
  @tracked fromDate;
  @tracked toDate;
  @tracked review;
  @tracked notBillable;
  @tracked verified;
  @tracked billed;
  @tracked editable;
  @tracked rejected;
  @tracked ordering = "-date";

  get analysisIndexController() {
    return getOwner(this).lookup("controller:analysis.index");
  }

  get intersectionModel() {
    return this.intersection.lastSuccessful?.value?.model;
  }

  get isAccountant() {
    return this.session.data.user.isAccountant;
  }

  get isSuperuser() {
    return this.session.data.user.isSuperuser;
  }

  @task
  *intersection() {
    const res = yield this.fetch.fetch(
      `/api/v1/reports/intersection?${new URLSearchParams({
        ...this.prepareParams(allQueryParams(this)),
        editable: 1,
        include: "task,project,customer,user",
      })}`,
      {
        method: "GET",
      }
    );

    yield this.store.pushPayload("report-intersection", res);

    return {
      model: this.store.peekRecord("report-intersection", res.data.id),
      meta: res.meta,
    };
  }

  get _customer() {
    const id = this.intersectionModel.customer.get("id");
    return id && this.store.peekRecord("customer", id);
  }

  get _project() {
    const id = this.intersectionModel.project.get("id");
    return id && this.store.peekRecord("project", id);
  }

  get _task() {
    const id = this.intersectionModel.task.get("id");
    return id && this.store.peekRecord("task", id);
  }

  get hasSelectedOwnReports() {
    return this.intersectionModel.user.get("id") === this.session.data.user.id;
  }

  get canVerify() {
    return (
      allQueryParams(this).reviewer === this.session.data.user.id ||
      this.isSuperuser
    );
  }

  get canBill() {
    return this.isAccountant || this.isSuperuser;
  }

  get needsReview() {
    return (
      this.intersectionModel?.review === null ||
      this.intersectionModel?.review === true
    );
  }

  get toolTipText() {
    let result = "";
    if (this.needsReview && this.canVerify) {
      result = TOOLTIP_NEEDS_REVIEW;
    } else if (!this.needsReview && !this.canVerify) {
      result = TOOLTIP_CANNOT_VERIFY;
    } else if (this.needsReview && !this.canVerify) {
      result = `${TOOLTIP_CANNOT_VERIFY} ${TOOLTIP_NEEDS_REVIEW}`;
    }
    return result;
  }

  @task
  *save(changeset) {
    try {
      const params = this.prepareParams(allQueryParams(this));

      const queryString = toQueryString(params);

      yield changeset.execute();
      const {
        data: { attributes, relationships },
      } = this.intersectionModel.serialize();

      const data = {
        type: "report-bulks",
        attributes: filterUnchanged(attributes, changeset.get("changes")),
        relationships: filterUnchanged(relationships, changeset.get("changes")),
      };

      yield this.fetch.fetch(`/api/v1/reports/bulk?editable=1&${queryString}`, {
        method: "POST",
        data,
      });

      this.router.transitionTo("analysis.index", {
        queryParams: {
          ...serializeQueryParams(allQueryParams(this), this.queryParamsState),
        },
      });

      this.notify.success("Reports were saved");
    } catch (e) {
      this.notify.error("Error while saving the reports");
    }

    this.unverifiedReports.pollReports();
  }

  @action
  validate(changeset) {
    changeset.validate();
  }

  @action
  cancel() {
    const task = this.analysisIndexController.data;

    if (task.lastSuccessful) {
      this.analysisIndexController.skipResetOnSetup = true;
    }
    this.router
      .transitionTo("analysis.index", {
        queryParams: {
          ...serializeQueryParams(allQueryParams(this), this.queryParamsState),
        },
      })
      .then(() => {
        this.analysisIndexController.skipResetOnSetup = false;
      });
  }

  @action
  resetChangeset(changeset) {
    // We have to defer the rollback for some milliseconds since the combobox
    // reset action triggers mutation of customer, task, and project which
    // would be run after this rollback and therefore trigger changes
    later(() => {
      changeset.rollback();
    });
  }

  get queryParamsState() {
    const states = {};
    for (const param of this.queryParams) {
      const defaultValue = getDefaultQueryParamValue(param);
      const currentValue = this[param];
      states[param] = {
        as: param,
        defaultValue,
        serializedValue: currentValue,
        value: currentValue,
        changed: currentValue !== defaultValue,
      };
      if (["fromDate", "toDate"].includes(param)) {
        states[param].serialize = serializeMoment;
        states[param].deserialize = deserializeMoment;
      }

      if (param === "id") {
        states[param].serialize = (arr) => {
          return (arr && Array.isArray(arr) && arr.join(",")) || null;
        };
        states[param].deserialize = (str) => {
          return (str && str.split(",")) || [];
        };
      }
    }
    return states;
  }

  resetQueryParams(...args) {
    if (!args[0]) {
      return;
    }
    const params = [...args[0]];
    for (const param of params) {
      this[param] = getDefaultQueryParamValue(param);
    }
  }

  prepareParams(params) {
    return cleanParams(
      underscoreQueryParams(
        serializeQueryParams(
          filterQueryParams(params, "editable"),
          this.queryParamsState
        )
      )
    );
  }
}
