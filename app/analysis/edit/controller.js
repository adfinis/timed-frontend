import { getOwner } from "@ember/application";
import Controller from "@ember/controller";
import { action, get } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { task } from "ember-concurrency";
import {
  underscoreQueryParams,
  serializeParachuteQueryParams,
  filterQueryParams,
} from "timed/utils/query-params";
import { cleanParams, toQueryString } from "timed/utils/url";
import IntersectionValidations from "timed/validations/intersection";

import { AnalysisQueryParams } from "../index/controller";

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
export const AnalysisEditQueryParams = AnalysisQueryParams.extend({
  id: {
    defaultValue: [],
    replace: true,
    refresh: true,
    serialize(arr) {
      return (arr && arr.join(",")) || null;
    },
    deserialize(str) {
      return (str && str.split(",")) || [];
    },
  },
});
/* eslint-enable ember/avoid-leaking-state-in-ember-objects */

const prepareParams = (params) =>
  cleanParams(
    underscoreQueryParams(
      serializeParachuteQueryParams(
        filterQueryParams(params, "editable"),
        AnalysisEditQueryParams
      )
    )
  );

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

export default class AnalysisEditController extends Controller.extend(
  AnalysisEditQueryParams.Mixin
) {
  IntersectionValidations = IntersectionValidations;

  @service notify;
  @service router;
  @service fetch;
  @service session;
  @service unverifiedReports;

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

  setup() {
    this.intersection.perform();
  }

  @task
  *intersection() {
    const res = yield this.fetch.fetch(
      `/api/v1/reports/intersection?${new URLSearchParams({
        ...prepareParams(this.allQueryParams),
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
    const id = get(this, "intersectionModel.customer.id");
    return id && this.store.peekRecord("customer", id);
  }

  get _project() {
    const id = get(this, "intersectionModel.project.id");
    return id && this.store.peekRecord("project", id);
  }

  get _task() {
    const id = get(this, "intersectionModel.task.id");
    return id && this.store.peekRecord("task", id);
  }

  get hasSelectedOwnReports() {
    return get(this, "intersectionModel.user.id") === this.session.data.user.id;
  }

  get canVerify() {
    return (
      this.allQueryParams.reviewer === this.session.data.user.id ||
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
      const params = prepareParams(this.allQueryParams);

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
          ...this.allQueryParams,
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
          ...this.allQueryParams,
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
}
