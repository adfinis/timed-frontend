/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import moment from 'moment'
import Ember from 'ember'
import { task, timeout } from 'ember-concurrency'

const { testing } = Ember

export default Component.extend({
  classNames: ['timed-clock'],

  hour: 0,
  minute: 0,
  second: 0,

  _update() {
    let now = moment()

    let second = now.seconds() * 6
    let minute = now.minutes() * 6 + second / 60
    let hour = (now.hours() % 12) / 12 * 360 + 90 + minute / 12

    this.setProperties({ second, minute, hour })
  },

  timer: task(function*() {
    for (;;) {
      this._update()

      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      yield timeout(1000)
    }
  }).on('didInsertElement')
})
