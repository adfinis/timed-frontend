/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed  from 'ember-computed-decorators'
import Ember     from 'ember'

const { testing } = Ember

/**
 * The datepicker button component
 *
 * @class DatepickerButtonComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The tag name
   *
   * This is an empty string so we do not have an element in the DOM
   *
   * @property {String} tagName
   * @public
   */
  tagName: '',

  /**
   * The body element into which the calendar tether should render
   *
   * We need to render the calendar into this component only for testing
   *
   * @property {Object} bodyElement
   * @public
   */
  @computed()
  bodyElement() {
    /* istanbul ignore next */
    return testing ? this : document.getElementsByTagName('body')[0]
  },

  /**
   * Whether to show the calendar
   *
   * @property {Boolean} showCalendar
   * @public
   */
  showCalendar: false,

  /**
   * The actions for the datepicker button component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Change the value and hide the calendar
     *
     * @method change
     * @param {moment} value The value to change to
     * @public
     */
    change(value) {
      this.get('attrs.on-change')(value)
      this.set('showCalendar', false)
    }
  }
})
