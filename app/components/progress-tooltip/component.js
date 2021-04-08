import Component from "@ember/component";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

/**
 * Component for a tooltip showing the progress of a task or project
 *
 * @class ProgressTooltipComponent
 * @extends Ember.Component
 * @public
 */
const ProgressTooltipComponent = Component.extend({
  /**
   * No tag name, since we attach the tooltip to a given target
   *
   * @property {String} tagName
   * @public
   */
  tagName: "",

  /**
   * Init hook, check the required params
   *
   * @method init
   * @public
   */
  init(...args) {
    this._super(...args);

    /* istanbul ignore next */
    if (!this.get("model")) {
      throw new Error("A model must be given");
    }

    /* istanbul ignore next */
    if (!this.get("target")) {
      throw new Error("A target for the tooltip must be given");
    }
  },

  /**
   * The delay between becoming 'visible' and fetching the data
   *
   * @property {Number} delay
   * @public
   */
  delay: 300,

  /**
   * Metadata fetcher service
   *
   * @property {MetadataFetcherService} metadataFetcher
   * @public
   */
  metadataFetcher: service("metadata-fetcher"),

  /**
   * The estimated time
   *
   * @property {moment.duration} estimated
   * @public
   */
  estimated: reads("model.estimatedTime"),

  /**
   * The spent time
   *
   * @property {moment.duration} spent
   * @public
   */
  spent: moment.duration(),

  /**
   * The current total progress
   *
   * @property {Number} progressTotal
   * @public
   */
  progressTotal: computed("estimated", "spent", function() {
    return this.get("estimated") && this.get("estimated").asHours()
      ? this.get("spent") / this.get("estimated")
      : 0;
  }),

  /**
   * The color of the badge and progress bar for total time spent
   *
   * @property {String} colorTotal
   * @public
   */
  colorTotal: computed("progressTotal", function() {
    if (this.get("progressTotal") > 1) {
      return "danger";
    } else if (this.get("progressTotal") >= 0.9) {
      return "warning";
    }

    return "success";
  }),

  /**
   * The current billable progress
   *
   * @property {Number} progressBillable
   * @public
   */
  progressBillable: computed("estimated", "billable", function() {
    return this.get("estimated") && this.get("estimated").asHours()
      ? this.get("billable") / this.get("estimated")
      : 0;
  }),

  /**
   * The color of the badge and progress bar for billable time spent
   *
   * @property {String} colorBillable
   * @public
   */
  colorBillable: computed("progressBillable", function() {
    if (this.get("progressBillable") > 1) {
      return "danger";
    } else if (this.get("progressBillable") >= 0.9) {
      return "warning";
    }

    return "success";
  }),

  /**
   * Whether the tooltip is visible or not
   *
   * @property {EmberConcurrency.Task} tooltipVisible
   * @public
   */
  tooltipVisible: computed("visible", function() {
    const task = this.get("_computeTooltipVisible");

    task.perform(this.get("visible"));

    return task;
  }),

  /**
   * Task to toggle the visibility and fetch the needed data
   *
   * @method _computeTooltipVisible
   * @param {Boolean} visible Whether the tooltip needs to become visible
   * @return {Boolean} Whether the tooltip is now visible
   * @public
   */
  _computeTooltipVisible: task(function*(visible) {
    if (visible) {
      yield timeout(this.get("delay"));

      const { spentTime, spentBillable } = yield this.get(
        "metadataFetcher.fetchSingleRecordMetadata"
      )
        .linked()
        .perform(this.get("model.constructor.modelName"), this.get("model.id"));

      this.setProperties({ spent: spentTime, billable: spentBillable });
    }

    return visible;
  }).restartable()
});

export default ProgressTooltipComponent;
