import Component from 'ember-component'
import { later } from 'ember-runloop'
import moment    from 'moment'
import { on }    from 'ember-computed-decorators'

export default Component.extend({
  _rotate(deg) {
    return `rotate(${deg}deg)`
  },

  _update() {
    let now    = moment()
    let second = now.seconds() * 6
    let minute = now.minutes() * 6 + second / 60
    let hour   = now.hours() % 12 / 12 * 360 + 90 + minute / 12

    if (this.$()) {
      this.$('.second').css('transform', this._rotate(second))
      this.$('.minute').css('transform', this._rotate(minute))
      this.$('  .hour').css('transform', this._rotate(hour))
    }
  },

  @on('didRender')
  _tick() {
    this._update()

    later(this, () => {
      this._tick()
    }, 1000)
  }
})
