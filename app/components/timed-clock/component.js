/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import moment    from 'moment'
import { on }    from 'ember-computed-decorators'
import { later } from 'ember-runloop'
import Ember     from 'ember'

const { testing } = Ember

/**
 * The timed clock component
 *
 * @class TimedClockComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Return the CSS syntax for rotation
   *
   * @method _rotate
   * @param {Number} deg The degrees to rotate
   * @return {String} The CSS syntax
   * @private
   */
  _rotate(deg) {
    return `rotate(${deg}deg)`
  },

  /**
   * Update the clocks CSS
   *
   * @method _update
   * @private
   */
  _update() {
    let now    = moment()
    let second = now.seconds() * 6
    let minute = now.minutes() * 6 + second / 60
    let hour   = now.hours() % 12 / 12 * 360 + 90 + minute / 12

    this.$('.second').css('transform', this._rotate(second))
    this.$('.minute').css('transform', this._rotate(minute))
    this.$('  .hour').css('transform', this._rotate(hour))
  },

  /**
   * Update the clock every second
   *
   * @method _tick
   * @private
   */
  @on('didRender')
  _tick() { // eslint-disable-line object-literal-jsdoc/obj-doc
    this._update()

    /* istanbul ignore if */
    if (!testing) {
      later(this, () => {
        this._tick()
      }, 1000)
    }
  }
})
