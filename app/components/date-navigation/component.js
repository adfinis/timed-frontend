/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import moment from "moment";

/**
 * The date navigation component
 *
 * @class DateNavigationComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ["btn-toolbar"],

  /**
   * The actions for the date navigation component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Set the current date to today
     *
     * @method setToday
     * @public
     */
    setToday() {
      const date = moment();

      this.get("on-change")(date);
    },

    /**
     * Decrease the current date by one day
     *
     * @method setPrevious
     * @public
     */
    setPrevious() {
      const date = moment(this.get("current")).subtract(1, "days");

      this.get("on-change")(date);
    },

    /**
     * Increase the current date by one day
     *
     * @method setNext
     * @public
     */
    setNext() {
      const date = moment(this.get("current")).add(1, "days");

      this.get("on-change")(date);
    },
  },
});
