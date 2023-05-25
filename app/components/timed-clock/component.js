import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

export default class TimedClock extends Component {
  @tracked hour = 0;
  @tracked minute = 0;
  @tracked second = 0;

  constructor(...args) {
    super(...args);
    this.timer.perform();
  }

  _update() {
    const now = moment();

    this.second = now.seconds() * 6;
    this.minute = now.minutes() * 6 + this.second / 60;
    this.hour = ((now.hours() % 12) / 12) * 360 + this.minute / 12;
  }

  @task
  *timer() {
    for (;;) {
      this._update();

      /* istanbul ignore else */
      if (Ember.testing) {
        return;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  }
}
