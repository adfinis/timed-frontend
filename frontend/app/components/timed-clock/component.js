import { setProperties } from "@ember/object";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

export default class TimedClock extends Component {
  @tracked hour = 0;
  @tracked minute = 0;
  @tracked second = 0;

  _update() {
    const now = moment();

    const second = now.seconds() * 6;
    const minute = now.minutes() * 6 + second / 60;
    const hour = ((now.hours() % 12) / 12) * 360 + minute / 12;

    setProperties(this, { second, minute, hour });
  }

  @task
  *timer() {
    for (;;) {
      this._update();

      /* istanbul ignore else */
      if (macroCondition(isTesting())) {
        return;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  }
}
