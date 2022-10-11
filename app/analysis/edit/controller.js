import Controller, { inject as controller } from "@ember/controller";
import { computed } from "@ember/object";
import { reads, or } from "@ember/object/computed";
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
      return (arr && arr.join(",")) || "";
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

export default Controller.extend(AnalysisEditQueryParams.Mixin, {
  IntersectionValidations,
  TOOLTIP_CANNOT_VERIFY,
  TOOLTIP_NEEDS_REVIEW,

  notify: service("notify"),
  ajax: service("ajax"),
  session: service("session"),
  router: service("router"),
  unverifiedReports: service(),

  analysisIndexController: controller("analysis.index"),
  intersectionModel: reads("intersection.lastSuccessful.value.model"),

  setup() {
    this.get("intersection").perform();
  },

  intersection: task(function* () {
    const res = yield this.get("ajax").request("/api/v1/reports/intersection", {
      method: "GET",
      data: {
        ...prepareParams(this.get("allQueryParams")),
        editable: 1,
        include: "task,project,customer",
      },
    });

    yield this.store.pushPayload("report-intersection", res);

    return {
      model: this.store.peekRecord("report-intersection", res.data.id),
      meta: res.meta,
    };
  }),

  _customer: computed("intersectionModel.customer.id", function () {
    const id = this.get("intersectionModel.customer.id");
    return id && this.store.peekRecord("customer", id);
  }),

  _project: computed("intersectionModel.project.id", function () {
    const id = this.get("intersectionModel.project.id");
    return id && this.store.peekRecord("project", id);
  }),

  _task: computed("intersectionModel.task.id", function () {
    const id = this.get("intersectionModel.task.id");
    return id && this.store.peekRecord("task", id);
  }),

  canVerify: computed(
    "allQueryParams.reviewer",
    "session.data.user",
    function () {
      return (
        this.get("allQueryParams.reviewer") ===
          this.get("session.data.user.id") ||
        this.get("session.data.user.isSuperuser")
      );
    }
  ),

  canBill: or(
    "session.data.user.isAccountant",
    "session.data.user.isSuperuser"
  ),

  needsReview: computed("intersectionModel", function () {
    return (
      this.get("intersectionModel.review") === null ||
      this.get("intersectionModel.review") === true
    );
  }),

  toolTipText: computed("canVerify", "needsReview", function () {
    let result = "";
    if (this.get("needsReview") && this.get("canVerify")) {
      result = TOOLTIP_NEEDS_REVIEW;
    } else if (!this.get("needsReview") && !this.get("canVerify")) {
      result = TOOLTIP_CANNOT_VERIFY;
    } else if (this.get("needsReview") && !this.get("canVerify")) {
      result = `${TOOLTIP_CANNOT_VERIFY} ${TOOLTIP_NEEDS_REVIEW}`;
    }
    return result;
  }),

  save: task(function* (changeset) {
    try {
      const params = prepareParams(this.get("allQueryParams"));

      const queryString = toQueryString(params);

      yield changeset.execute();

      const {
        data: { attributes, relationships },
      } = this.get("intersectionModel").serialize();

      const data = {
        type: "report-bulks",
        attributes: filterUnchanged(attributes, changeset.get("changes")),
        relationships: filterUnchanged(relationships, changeset.get("changes")),
      };

      yield this.get("ajax").request(
        `/api/v1/reports/bulk?editable=1&${queryString}`,
        {
          method: "POST",
          data: { data },
        }
      );

      this.transitionToRoute("analysis.index", {
        queryParams: {
          ...this.get("allQueryParams"),
        },
      });

      this.get("notify").success("Reports were saved");
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while saving the reports");
    }

    this.unverifiedReports.pollReports();
  }),

  actions: {
    validate(changeset) {
      changeset.validate();
    },

    cancel() {
      const task = this.analysisIndexController.data;

      /* istanbul ignore next */
      if (task.lastSuccessful) {
        this.set("analysisIndexController.skipResetOnSetup", true);
      }

      this.router
        .transitionToRoute("analysis.index", {
          queryParams: {
            ...this.get("allQueryParams"),
          },
        })
        .then(() => {
          this.set("analysisIndexController.skipResetOnSetup", false);
        });
    },

    reset(changeset) {
      // We have to defer the rollback for some milliseconds since the combobox
      // reset action triggers mutation of customer, task, and project which
      // would be run after this rollback and therefore trigger changes
      later(() => {
        changeset.rollback();
      });
    },
  },
});
