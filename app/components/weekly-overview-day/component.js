/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import { computed } from '@ember/object'
import { htmlSafe } from '@ember/string'

/**
 * Component to display a single day in the weekly overview
 *
 * This contains a bar which shows the worktime and the day
 *
 * @class WeeklyOverviewDayComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Attribute bindings
   *
   * @property {String[]} attributeBindings
   * @public
   */
  attributeBindings: ['style', 'title'],

  /**
   * Class name bindings
   *
   * @property {String[]} classNameBindings
   * @public
   */
  classNameBindings: ['active', 'workday::weekend', 'absence', 'holiday'],

  /**
   * Whether there is an absence on this day
   *
   * @property {Boolean} absence
   * @public
   */
  absence: false,

  /**
   * Whether there is an holiday on this day
   *
   * @property {Boolean} holiday
   * @public
   */
  holiday: false,

  /**
   * Whether it is the currently selected day
   *
   * @property {Boolean} active
   * @public
   */
  active: false,

  /**
   * Maximum worktime in hours
   *
   * @property {Number} max
   * @public
   */
  max: 20,

  /**
   * A prefix to the title
   *
   * @property {String} prefix
   * @public
   */
  prefix: '',

  /**
   * The element title
   *
   * This is shown on hover. It contains the worktime.
   *
   * @property {String} title
   * @public
   */
  title: computed('worktime', 'prefix', function() {
    let pre = this.get('prefix.length') ? `${this.get('prefix')}, ` : ''

    let title = `${this.get('worktime').hours()}h`

    if (this.get('worktime').minutes()) {
      title += ` ${this.get('worktime').minutes()}m`
    }

    return `${pre}${title}`
  }),

  /**
   * Whether the day is a workday
   *
   * @property {Boolean} workday
   * @public
   */
  workday: true,

  /**
   * The style of the element
   *
   * This computes the height of the bar
   *
   * @property {String} style
   * @public
   */
  style: computed('max', 'worktime', function() {
    let height = Math.min(
      this.get('worktime').asHours() / this.get('max') * 100,
      100
    )

    return htmlSafe(`height: ${height}%;`)
  }),

  /**
   * Click event - fire the on-click action
   */
  click(event) {
    let action = this.get('on-click')

    if (action) {
      event.preventDefault()

      this.get('on-click')(this.get('day'))
    }
  }
})
