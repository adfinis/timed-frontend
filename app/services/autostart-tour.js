import { computed } from "@ember/object";
import Service from "@ember/service";

/**
 * Autostart tour service
 *
 * This service helps connecting the tours to the localstorage
 *
 * @class AutostartTourService
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  init(...args) {
    this._super(...args);

    this.set("tours", [
      "index.activities",
      "index.attendances",
      "index.reports"
    ]);
  },

  /**
   * The item key to use in the localstorage
   *
   * @property {String} doneKey
   * @public
   */
  doneKey: "timed-tour",

  /**
   * All done tours
   *
   * @property {String[]} done
   * @public
   */
  done: computed({
    get() {
      return Array.from(JSON.parse(localStorage.getItem(this.doneKey)) || []);
    },
    set(key, value = []) {
      localStorage.setItem(this.doneKey, JSON.stringify(value));

      return value;
    }
  }),

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

    return tours.every(tour => done.includes(tour));
  }
});
