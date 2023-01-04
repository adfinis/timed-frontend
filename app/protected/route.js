/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import moment from "moment";

/**
 * The protected route
 *
 * @class ProtectedRoute
 * @extends Ember.Route
 * @uses EmberSimpleAuth.AuthenticatedRouteMixin
 * @public
 */
export default class ProtectedRoute extends Route {
  @service session;
  @service("autostart-tour") autostartTour;
  @service router;
  @service media;
  @service store;
  @service fetch;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "login");
  }

  async model() {
    const user = await this.fetch.fetch(
      `/api/v1/users/me?${new URLSearchParams({
        include: "supervisors,supervisees",
      })}`,
      {
        method: "GET",
      }
    );

    await this.store.pushPayload("user", user);

    const usermodel = await this.store.peekRecord("user", user.data.id);

    // Fetch current employment
    const employment = await this.store.query("employment", {
      user: usermodel.id,
      date: moment().format("YYYY-MM-DD"),
      include: "location",
    });

    if (!employment.length) {
      this.router.transitionTo("no-access");
    }

    this.session.data.user = usermodel;

    return usermodel;
  }

  /**
   * Setup controller hook, evaluate if the welcome modal must be shown
   *
   * @method setupController
   * @param {Ember.Controller} controller The controller
   * @param {User} model The current user
   * @public
   */
  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    const visible =
      !this.autostartTour.allDone() &&
      !model.tourDone &&
      (this.media.isMd || this.media.isLg || this.media.isXl);

    controller.set("visible", visible);
  }

  /**
   * Loading action
   *
   * Set loading property on the controller
   * @method loading
   * @param {Ember.Transition} transition The transition which is loading
   * @public
   */
  @action
  loading(transition) {
    //eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor("protected");
    if (controller) {
      controller.loading = true;

      if (transition) {
        transition.promise.finally(function () {
          transition.send("finished");
        });
      }
    }
  }

  @action
  finished() {
    //eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor("protected");

    if (controller) {
      controller.loading = false;
    }
  }
}
