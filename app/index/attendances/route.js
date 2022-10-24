/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

/**
 * The index attendances route
 *
 * @class IndexAttendancesRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(RouteAutostartTourMixin, {
  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service("notify"),

  /**
   * Setup controller hook, set the current user
   *
   * @method setupContrller
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller, ...args) {
    this._super(controller, ...args);

    controller.set("user", this.modelFor("protected"));
  },

  /**
   * The actions for the index attendance route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Save an attendance
     *
     * @method saveAttendance
     * @param {Changeset} attendance The attendance to save
     * @public
     */
    async saveAttendance(attendance) {
      try {
        await attendance.save();

        this.notify.success("Attendance was saved");
      } catch (e) {
        /* istanbul ignore next */
        this.notify.error("Error while saving the attendance");
      }
    },

    /**
     * Delete an attendance
     *
     * @method deleteAttendance
     * @param {Attendance} attendance The attendance to delete
     * @public
     */
    async deleteAttendance(attendance) {
      try {
        await this.store
          .peekRecord("attendance", attendance.get("id"))
          .destroyRecord();

        this.notify.success("Attendance was deleted");
      } catch (e) {
        /* istanbul ignore next */
        this.notify.error("Error while deleting the attendance");
      }
    },

    /**
     * Add a new attendance
     *
     * @method addAttendance
     * @public
     */
    async addAttendance() {
      try {
        const date = this.controllerFor("index")
          .get("date")
          .clone();

        const from = date.clone().set({ h: 8, m: 0, s: 0, ms: 0 });
        const to = date.clone().set({ h: 11, m: 30, s: 0, ms: 0 });

        const attendance = this.store.createRecord("attendance", {
          date,
          from,
          to
        });

        await attendance.save();

        this.notify.success("Attendance was added");
      } catch (e) {
        /* istanbul ignore next */
        this.notify.error("Error while adding the attendance");
      }
    }
  }
});
