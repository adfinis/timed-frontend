/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

/**
 * The duration since component
 *
 * This component helps to determine the duration from a certain moment until
 * now. Optionally you can provide an already elapsed time to add to the
 * duration.
 *
 * Example:
 * ```htmlbars
 * {{duration-since someStartMoment elapsed=someDuration}}
 * ```
 *
 * @class DurationSinceComponent
 * @extends Ember.Component
 * @public
 */
export default class DurationSinceComponent extends Component {
  constructor(...args) {
    super(...args);
    this.timer.perform();
  }

  /**
   * The moment from which the duration is computed
   *
   * @property {moment} from
   * @public
   */
  get from() {
    return this.args.from ?? moment();
  }

  /**
   * The already elapsed time which is added to the computed duration
   *
   * @property {moment.duration} elapsed
   * @public
   */
  get elapsed() {
    return this.args.elapsed ?? moment.duration();
  }

  /**
   * The total duration since the from moment plus the elapsed time
   *
   * @property {moment.duration} duration
   * @public
   */
  @tracked duration = moment.duration();

  /**
   * Compute the duration
   *
   * @method _compute
   * @private
   */
  _compute() {
    this.duration = moment.duration(moment().diff(this.from)).add(this.elapsed);
  }

  /**
   * The timer function, which causes the duration to be recomputed every second
   *
   * @proprety {*} timer
   * @public
   */
  @task
  *timer() {
    for (;;) {
      this._compute();

      /* istanbul ignore else */
      if (Ember.testing) {
        return;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  }
}
