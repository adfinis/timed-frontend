import classic from "ember-classic-decorator";
import { action } from "@ember/object";
import { classNames } from "@ember-decorators/component";
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
@classic
@classNames("btn-toolbar")
export default class DateNavigation extends Component {
 /**
  * Set the current date to today
  *
  * @method setToday
  * @public
  */
 @action
 setToday() {
   const date = moment();

   this["on-change"](date);
 }

 /**
  * Decrease the current date by one day
  *
  * @method setPrevious
  * @public
  */
 @action
 setPrevious() {
   const date = moment(this.current).subtract(1, "days");

   this["on-change"](date);
 }

 /**
  * Increase the current date by one day
  *
  * @method setNext
  * @public
  */
 @action
 setNext() {
   const date = moment(this.current).add(1, "days");

   this["on-change"](date);
 }
}
