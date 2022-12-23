/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
/**
 * The protected controller
 *
 * @class ProtectedController
 * @extends Ember.Controller
 * @public
 */
export default class ProtectedController extends Controller {
  @service notify;
  @service router;
  @service session;
  @service("autostart-tour") autostartTour;

  @tracked visible;
  @tracked loading;

  /**
   * Invalidate the session
   *
   * @method invalidateSession
   * @public
   */
  @action
  invalidateSession() {
    this.autostartTour.done = [];

    this.session.invalidate();
    this.router.transitionTo("login");
  }

  /**
   * Close the current tour
   *
   * @method _closeCurrentTour
   * @private
   */
  _closeCurrentTour() {
    const currentRoute = this.router.currentRouteName.replace(/\.index$/, "");

    if (this.autostartTour.tours.includes(currentRoute)) {
      // TODO: How to refactor this shit?
      this.controllerFor?.get("tour").close();
    }
  }

  /**
   * Never start the tour, set the tour done property on the current user
   *
   * @method neverTour
   * @public
   */
  @action
  async neverTour() {
    try {
      const user = this.model;

      user.tourDone = true;

      await user.save();

      this._closeCurrentTour();
      this.visible = false;
    } catch (error) {
      this.notify.error("Error while saving the user");
    }
  }

  /**
   * Skip the tour for now
   *
   * @method laterTour
   * @public
   */
  @action
  laterTour() {
    this._closeCurrentTour();
    this.autostartTour.done = this.autostartTour.tours;
    this.visible = false;

    this.router.transitionTo("index.activities");
  }

  /**
   * Start the tour
   *
   * @method startTour
   * @public
   */
  @action
  startTour() {
    this.autostartTour.done = [];
    this.visible = false;

    this.router.transitionTo("index.activities");
  }
}
