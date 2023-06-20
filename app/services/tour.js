import { schedule, later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { waitFor } from "@ember/test-waiters";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import Tour from "ember-shepherd/services/tour";
import TOURS from "timed/tours";
import { cached } from "tracked-toolbox";

export default class TourService extends Tour {
  @service notify;
  @service media;
  @service router;
  @service autostartTour;
  @tracked model;

  constructor(...args) {
    super(...args);

    this.modal = true;
    if (macroCondition(isTesting())) {
      this.modalContainer = document.getElementById("ember-testing");
    }

    this.boundOnRouteChangeHandler = () => {
      if (this.hasTourForRoute) {
        if (this.isActive) {
          this.hide();
        }
        this.startTour();
      }
    };
  }

  willDestroy(...args) {
    this.detachRouteListener();
    this._onTourFinish = () => {};

    super.willDestroy(...args);
  }

  @cached
  get routeName() {
    return this.router.currentRouteName.replace(/\.index$/, "");
  }

  prepare(model) {
    this.model = model;

    this.startFromBeginning();

    this.attachRouteListener();
  }

  startFromBeginning() {
    if (this.routeName !== "index.activities") {
      this.router.transitionTo("index.activities.index");
    }
  }

  async prepareTourForCurrentRoute() {
    if (this.hasTourForRoute) {
      const tours = this.routeTours;
      await this.addSteps(tours.map(this.tourToSteps));
    }
  }

  attachRouteListener() {
    this.router.on("routeDidChange", this.boundOnRouteChangeHandler);
  }

  detachRouteListener() {
    this.router.off("routeDidChange", this.boundOnRouteChangeHandler);
  }

  get hasTourForRoute() {
    return this.autostartTour.tours.includes(this.routeName);
  }

  get defaultStepOptions() {
    return {
      beforeShowPromise() {
        return new Promise(function (resolve) {
          schedule("afterRender", this, function () {
            window.scrollTo(0, 0);
            resolve();
          });
        });
      },
      highlightClass: "highlight",
      scrollTo: true,
    };
  }

  tourToSteps(data) {
    return {
      id: data.id,
      attachTo: {
        element: data.target,
        on: data.placement,
      },
      title: data.title,
      text: data.content,
      buttons: [
        {
          classes: "shepherd-button-secondary",
          text: "Exit",
          type: "cancel",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
    };
  }

  get routeTours() {
    return TOURS[this.routeName];
  }

  get _wantsTour() {
    return (
      !this.model.tourDone &&
      !this.autostartTour.done.includes(this.routeName) &&
      (this.media.isMd || this.media.isLg || this.media.isXl)
    );
  }

  // TODO: see if needed, maybe not
  closeCurrentTour() {
    if (this.tour.isActive) {
      this.tour.hide();
    }
  }

  @waitFor
  async startTour() {
    if (this._wantsTour && this.hasTourForRoute) {
      await this.prepareTourForCurrentRoute();
      schedule("afterRender", this, () => {
        this._onTourFinish = async () => {
          const done = this.autostartTour.done;
          done.push(this.routeName);
          this.autostartTour.done = done;

          if (this.autostartTour.allDone) {
            try {
              const user = this.model;

              user.tourDone = true;

              await user.save();
              this.notify.info("Congratulations you completed the tour!");
            } catch (error) {
              /* istanbul ignore next */
              this.notify.error("Error while saving the user");
            }
          } else {
            try {
              await this.router.transitionTo(
                this.autostartTour.undoneTours.shift() ?? "index"
              );
            } catch (error) {
              this.notify.error("unexpected error");
            }
          }
        };

        later(this, () => {
          this.start();
        });
      });
    }
  }
}
