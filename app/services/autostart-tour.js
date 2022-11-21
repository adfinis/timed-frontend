import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

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
  constructor(...args) {
    super(...args);

    this.tours = ["index.activities", "index.attendances", "index.reports"];
  }

  /**
   * The item key to use in the localstorage
   *
   * @property {String} doneKey
   * @public
   */
  @tracked doneKey = "timed-tour";

  /**
   * All done tours
   *
   * @property {String[]} done
   * @public
   */
  get done() {
    return Array.from(JSON.parse(localStorage.getItem(this.doneKey)) || []);
  }

  set done(value = []) {
    localStorage.setItem(this.doneKey, JSON.stringify(value));
  }

  /**
   * Whether all tours are done
   *
   * @method allDone
   * @return {Boolean} Whether all tours are done
   * @public
   */
  allDone() {
    const tours = this.tours;
    const done = this.done;

    return tours.every((tour) => done.includes(tour));
  }
}
