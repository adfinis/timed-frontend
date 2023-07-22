/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import moment from "moment";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

/**
 * The index reports route
 *
 * @class IndexReportsRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexReportsRoute extends Route.extend(
  RouteAutostartTourMixin
) {
  /**
   * Before model hook, fetch all absence types
   *
   * @method beforeModel
   * @return {AbsenceType[]} All absence types
   * @public
   */
  beforeModel(...args) {
    super.beforeModel(...args);

    return this.store.findAll("absence-type");
  }

  async setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.set("user", this.modelFor("protected"));
    controller.set("rescheduleDate", model);

    if (controller.task) {
      try {
        await this.store.createRecord("report", {
          task: await this.store.findRecord("task", controller.task),
          duration: controller.duration
            ? moment.duration(controller.duration)
            : "",
          date: model,
          comment: controller.comment ?? "",
          user: this.modelFor("protected"),
          review: controller.review ?? false,
          notBillable: controller.notBillable ?? false,
        });

        controller.task = null;
        controller.comment = null;
        controller.duration = null;
        controller.review = null;
        controller.notBillable = null;

        this.notify.success(
          "Temporary report was created. Please amend it and save it or delete it."
        );
      } catch {
        /* istanbul ignore next */
        this.notify.error("Could not create report");
      }
    }
  }
}
