/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import { htmlSafe } from 'ember-string'

/**
 * The weekly overview
 *
 * @class WeeklyOverviewComponent
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
  attributeBindings: ['style'],

  /**
   * The height of the overview in pixels
   *
   * @property {Number} height
   * @public
   */
  height: 150,

  /**
   * The expected worktime in hours
   *
   * @property {Number} hours
   * @public
   */
  @computed('expected')
  hours(expected) {
    return expected.asHours()
  },

  /**
   * The style of the element
   *
   * This computes the height of the element
   *
   * @property {String} style
   * @public
   */
  @computed('height')
  style(height) {
    return htmlSafe(`height: ${height}px;`)
  }
})
