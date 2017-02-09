import Component from 'ember-component'
import moment    from 'moment'
import { on }    from 'ember-computed-decorators'
import { later } from 'ember-runloop'
import Ember     from 'ember'

const { testing } = Ember

export default Component.extend({
  _rotate(deg) {
    return `rotate(${deg}deg)`
  },

  _update() {
    let now    = moment()
    let second = now.seconds() * 6
    let minute = now.minutes() * 6 + second / 60
    let hour   = now.hours() % 12 / 12 * 360 + 90 + minute / 12

    this.$('.second').css('transform', this._rotate(second))
    this.$('.minute').css('transform', this._rotate(minute))
    this.$('  .hour').css('transform', this._rotate(hour))
  },

  @on('didRender')
  _tick() {
    this._update()

    /* istanbul ignore if */
    if (!testing) {
      later(this, () => {
        this._tick()
      }, 1000)
    }
  }
})
