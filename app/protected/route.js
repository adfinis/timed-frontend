import { action } from "@ember/object";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

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
  @service currentUser;
  @service("autostart-tour") autostartTour;
  @service router;
  @service media;
  @service store;
  @service fetch;

  async beforeModel(transition) {
    await this.session.requireAuthentication(transition, "login");
    await this.currentUser.load();
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
      !this.autostartTour.allDone &&
      !this.currentUser.user.tourDone &&
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
