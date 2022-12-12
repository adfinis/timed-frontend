import Mixin from "@ember/object/mixin";
import { schedule, later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import RouteTourMixin from "ember-site-tour/mixins/route-tour";

/**
 * Mixin for a route which has a tour
 *
 * This mixin causes the tour to start after activating the route. It will stop
 * the tour of the parent route and start it again after leaving.
 *
 * @class RouteAutostartTourMixin
 * @extends Ember.Mixin
 * @uses EmberSiteTour.RouteTourMixin
 * @public
 */
export default Mixin.create(RouteTourMixin, {
  autostartTour: service("autostart-tour"),
  notify: service("notify"),
  media: service("media"),

  /**
   * Get the route name of the parent route
   *
   * @method _getParentRouteName
   * @return {String} The parent route name
   * @private
   */
  _getParentRouteName() {
    const parts = this.routeName.split(".");

    parts.pop();

    return parts.join(".");
  },

  /**
   * Check whether the user wants a tour on this page
   *
   * A user wants a tour if:
   *   1. He is not on a mobile device
   *   2. He has not already completed or skipped all tours
   *   3. He has not already completed this certain tour
   *
   * @method _wantsTour
   * @param {String} routeName The name of the route to check
   * @param {User[]} user The current user
   * @return {Boolean} Whether the user wants a tour
   * @private
   */
  _wantsTour(routeName, user) {
    return (
      !user.get("tourDone") &&
      !this.autostartTour.get("done").includes(routeName) &&
      (this.get("media.isMd") ||
        this.get("media.isLg") ||
        this.get("media.isXl"))
    );
  },

  /**
   * Stop the parent tour if there is one
   *
   * @method stopParentTour
   * @public
   */
  stopParentTour() {
    const parentRouteName = this._getParentRouteName();

    if (!parentRouteName.length) {
      return;
    }

    const tour = this.controllerFor(parentRouteName).get("tour");

    if (tour) {
      schedule("afterRender", this, () => {
        tour.close();
      });
    }
  },

  /**
   * Start the parent tour if there is one
   *
   * @method startParentTour
   * @public
   */
  startParentTour() {
    const parentRouteName = this._getParentRouteName();

    if (!parentRouteName.length) {
      return;
    }

    if (this._wantsTour(parentRouteName, this.modelFor("protected"))) {
      const tour = this.controllerFor(parentRouteName).get("tour");

      if (tour) {
        schedule("afterRender", this, () => {
          tour.start();
        });
      }
    }
  },

  /**
   * Start the current tour
   *
   * @method startTour
   * @public
   */
  startTour() {
    if (this._wantsTour(this.routeName, this.modelFor("protected"))) {
      schedule("afterRender", this, () => {
        const tour = this.get("controller.tour");

        /* istanbul ignore next */
        tour.on("tour.end", async (event) => {
          if (event.currentStep + 1 !== event.tour._steps.length) {
            return;
          }

          const done = this.autostartTour.get("done");

          done.push(this.routeName);

          this.autostartTour.set("done", done);

          if (this.autostartTour.allDone()) {
            try {
              const user = this.modelFor("protected");

              user.set("tourDone", true);

              await user.save();
              this.notify.info("Congratulations you completed the tour!");
            } catch (error) {
              /* istanbul ignore next */
              this.notify.error("Error while saving the user");
            }
          }
        });

        later(this, () => {
          tour.start();
        });
      });
    }
  },

  /**
   * Activate hook, start the tour and stop the parent route
   *
   * @method activate
   * @public
   */
  activate(...args) {
    this._super(...args);

    this.stopParentTour();
    this.startTour();
  },

  /**
   * Deactivate hook, start the parent route
   *
   * @method deactivate
   * @public
   */
  deactivate(...args) {
    this.startParentTour();

    this._super(...args);
  },
});
