import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import TOURS from "timed/tours";

/**
 * Autostart tour service
 *
 * This service helps connecting the tours to the localstorage
 *
 * @class AutostartTourService
 * @extends Ember.Service
 * @public
 */
export default class AutostartTourService extends Service {
  tours = Object.keys(TOURS);
  /**
   * The item key to use in the localstorage
   *
   * @property {String} doneKey
   * @public
   */
  @tracked doneKey = "timed-tour";

  get done() {
    return Array.from(JSON.parse(localStorage.getItem(this.doneKey)) || []);
  }

  set done(value = []) {
    localStorage.setItem(this.doneKey, JSON.stringify(value));
  }

  get undoneTours() {
    return this.tours.filter((tour) => !this.done.includes(tour));
  }

  get allDone() {
    return this.undoneTours.length === 0;
  }
}
