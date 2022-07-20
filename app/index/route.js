/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import moment from "moment";
import { all } from "rsvp";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

const DATE_FORMAT = "YYYY-MM-DD";

/**
 * The index route
 *
 * @class IndexRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(RouteAutostartTourMixin, {
  /**
   * The query params
   *
   * @property {Object} queryParams
   * @property {Object} queryParams.day
   * @public
   */
  queryParams: {
    day: { refreshModel: true },
  },

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service(),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service("notify"),

  /**
   * Model hook, return the selected day as moment object
   *
   * @method model
   * @param {Object} params The query params
   * @param {String} params.day The selected day
   * @return {moment} The selected day as moment object
   * @public
   */
  model({ day }) {
    return moment(day, DATE_FORMAT);
  },

  /**
   * After model hook, fetch all activities, attendances and reports of the
   * selected day, toghether with necessary data related to them.
   *
   * @method afterModel
   * @param {moment} model The selected day
   * @return {RSVP.Promise} A promise which resolves after all data is fetched
   * @public
   */
  afterModel(model) {
    const userId = this.get("session.data.user.id");
    const day = model.format(DATE_FORMAT);
    const from = moment(model).subtract(20, "days").format(DATE_FORMAT);
    const to = moment(model).add(10, "days").format(DATE_FORMAT);
    const location = this.store
      .peekRecord("user", userId)
      .get("activeEmployment.location.id");

    return all([
      this.store.query("activity", {
        include: "task,task.project,task.project.customer",
        day,
      }),
      this.store.query("attendance", { date: day }),
      this.store.query("absence-type", {}),
      this.store.query("report", {
        include: "task,task.project,task.project.customer",
        date: day,
        user: userId,
      }),
      /* eslint-disable camelcase */
      this.store.query("report", {
        from_date: from,
        to_date: to,
        user: userId,
      }),
      this.store.query("absence", {
        from_date: from,
        to_date: to,
        user: userId,
      }),
      this.store.query("public-holiday", {
        from_date: from,
        to_date: to,
        location,
      }),
      /* eslint-enable camelcase */
    ]);
  },

  setupController(controller, model, ...args) {
    this._super(controller, model, ...args);

    controller.set("user", this.modelFor("protected"));
    controller.get("setCenter").perform({ moment: model });

    controller.set("newAbsence", {
      dates: [model],
      comment: "",
      absenceType: null,
    });
  },

  actions: {
    /**
     * Edit an existing absence
     *
     * @method editAbsence
     * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
     * @public
     */
    async saveAbsence(changeset) {
      try {
        this.send("loading");

        await changeset.save();

        this.set("controller.showEditModal", false);
      } catch (e) {
        /* istanbul ignore next */
        this.get("notify").error("Error while saving the absence");
      } finally {
        this.send("finished");
      }
    },

    /**
     * Delete an absence
     *
     * @method deleteAbsence
     * @param {Absence} absence The absence to delete
     * @public
     */
    async deleteAbsence(absence) {
      try {
        this.send("loading");

        await absence.destroyRecord();
      } catch (e) {
        /* istanbul ignore next */
        this.get("notify").error("Error while deleting the absence");
      } finally {
        this.send("finished");
      }
    },

    /**
     * Add one or more absences
     *
     * @method addAbsence
     * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
     * @public
     */
    async addAbsence(changeset) {
      try {
        const absenceType = changeset.get("absenceType");
        const comment = changeset.get("comment");

        changeset.get("dates").forEach(async (date) => {
          const absence = this.store.createRecord("absence", {
            absenceType,
            date,
            comment,
          });

          await absence.save();
        });

        changeset.rollback();

        this.set("controller.showAddModal", false);
      } catch (e) {
        /* istanbul ignore next */
        this.get("notify").error("Error while adding the absence");
      } finally {
        this.send("finished");
      }
    },
  },
});
