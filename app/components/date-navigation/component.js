/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { action } from "@ember/object";
import Component from "@glimmer/component";
import moment from "moment";

/**
 * The date navigation component
 *
 * @class DateNavigationComponent
 * @extends Ember.Component
 * @public
 */
export default class DateNavigationComponent extends Component {
  /**
   * Set the current date to today
   *
   * @method setToday
   * @public
   */
  @action
  setToday() {
    const date = moment();

    this.args.onChange(date);
  }
  /**
   * Decrease the current date by one day
   *
   * @method setPrevious
   * @public
   */
  @action
  setPrevious() {
    const date = moment(this.args.current).subtract(1, "days");

    this.args.onChange(date);
  }

  /**
   * Increase the current date by one day
   *
   * @method setNext
   * @public
   */
  @action
  setNext() {
    const date = moment(this.args.current).add(1, "days");

    this.args.onChange(date);
  }
}
