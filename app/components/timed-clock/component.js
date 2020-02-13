/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

export default Component.extend({
  classNames: ["timed-clock"],

  hour: 0,
  minute: 0,
  second: 0,

  _update() {
    const now = moment();

    const second = now.seconds() * 6;
    const minute = now.minutes() * 6 + second / 60;
    const hour = ((now.hours() % 12) / 12) * 360 + minute / 12;

    this.setProperties({ second, minute, hour });
  },

  timer: task(function*() {
    for (;;) {
      this._update();

      /* istanbul ignore else */
      if (Ember.testing) {
        return;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  }).on("didInsertElement")
});
