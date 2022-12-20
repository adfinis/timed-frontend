import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import moment from "moment";

/**
 * Component for a tooltip showing the progress of a task or project
 *
 * @class ProgressTooltipComponent
 * @extends Ember.Component
 * @public
 */
export default class ProgressTooltipComponent extends Component {
  // The delay between becoming 'visible' and fetching the data
  delay = 300;

  @tracked spent;
  @tracked billable;

  @service("metadata-fetcher") metadata;

  constructor(...args) {
    super(...args);

    /* istanbul ignore next */
    if (!this.args.model) {
      throw new Error("A model must be given");
    }

    /* istanbul ignore next */
    if (!this.args.target) {
      throw new Error("A target for the tooltip must be given");
    }

    this.spent = moment.duration();
  }

  get estimated() {
    return this.args.model.estimatedTime;
  }

  get progressTotal() {
    return this.estimated && this.estimated.asHours()
      ? this.spent / this.estimated
      : 0;
  }

  // The color of the badge and progress bar for billable time spent
  get colorBillable() {
    if (this.progressBillable > 1) {
      return "danger";
    } else if (this.progressBillable >= 0.9) {
      return "warning";
    }

    return "success";
  }

  // The color of the badge and progress bar for total time spent
  get colorTotal() {
    if (this.progressTotal > 1) {
      return "danger";
    } else if (this.progressTotal >= 0.9) {
      return "warning";
    }

    return "success";
  }

  // The current billable progress
  get progressBillable() {
    return this.estimated && this.estimated.asHours()
      ? this.billable / this.estimated
      : 0;
  }

  get tooltipVisible() {
    return this._toolTipVisible.value ?? false;
  }

  _toolTipVisible = trackedTask(this, this._computeTooltipVisible, () => [
    this.args.visible,
  ]);

  @restartableTask
  *_computeTooltipVisible(visible) {
    if (visible) {
      yield timeout(this.delay);

      const { spentTime, spentBillable } =
        yield this.metadata.fetchSingleRecordMetadata
          .linked()
          .perform(this.args.model.constructor.modelName, this.args.model.id);

      this.spent = spentTime;
      this.billable = spentBillable;
    }

    return visible;
  }
}
