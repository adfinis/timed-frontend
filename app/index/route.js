/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import moment from "moment";
import { all } from "rsvp";

const DATE_FORMAT = "YYYY-MM-DD";

/**
 * The index route
 *
 * @class IndexRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexRoute extends Route {
  lastUpdateDate = null;

  queryParams = {
    day: {
      refreshModel: true,
    },
  };

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  @service session;
  @service store;

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
    return day ? moment(day, DATE_FORMAT) : moment(DATE_FORMAT);
  }

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
    const formattedDate = model.format();
    if (formattedDate === this.lastUpdateDate) {
      return;
    }

    this.lastUpdateDate = formattedDate;

    const userId = this.session.data.user.id;
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
        include: "task,task.project,task.project.customer,verified-by",
        date: day,
        user: userId,
      }),
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
    ]);
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.date = model;
    controller.set("user", this.modelFor("protected"));
    controller.setCenter.perform({ moment: model });

    controller.set("newAbsence", {
      dates: [model],
      comment: "",
      absenceType: null,
    });
  }
}
