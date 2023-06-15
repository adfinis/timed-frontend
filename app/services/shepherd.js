import { schedule, later } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import TOURS from "timed/tours";

export default class Shepherd extends Service {
  @service tour;
  @service notify;
  @service media;
  @service router;
  @service autostartTour;
  @tracked model;

  get routeName() {
    return this.router.get("currentRoute")?.name;
  }
  async prepare() {
    this.addDefaultStepsOptions();
    await this.startFromBeginning();
    await this.showToursOfCurrentRoute();
    this.watchRouteChanges();
  }

  async showToursOfCurrentRoute() {
    if (this.hasTourForRoute()) {
      const tours = this.getRouteTours();
      await this.tour.addSteps(tours.map(this.tourToSteps));
    }
  }

  async startFromBeginning() {
    if (this.routeName !== "index.activities.index") {
      await this.router.transitionTo("index.activities.index");
    }
  }

  watchRouteChanges() {
    this.router.on("routeDidChange", () => {
      if (this.hasTourForRoute()) {
        this.tour.hide();
        this.startTour();
      }
    });
  }

  hasTourForRoute() {
    return this.autostartTour.tours.includes(this.routeName);
  }

  addDefaultStepsOptions() {
    this.tour.defaultStepOptions = {
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
    this.tour.modal = true;
  }

  tourToSteps(data) {
    return {
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

  getRouteTours() {
    return TOURS[this.routeName];
  }

  addModelOfProtected(model) {
    this.model = model;
  }

  _wantsTour() {
    return (
      !this.model.tourDone &&
      !this.autostartTour.done.includes(this.routeName) &&
      (this.media.isMd || this.media.isLg || this.media.isXl)
    );
  }

  async startTour() {
    if (this._wantsTour()) {
      await this.showToursOfCurrentRoute();
      schedule("afterRender", this, () => {
        this.tour._onTourFinish = async () => {
          const done = this.autostartTour.done;
          done.push(this.routeName);
          this.autostartTour.done = done;

          if (this.autostartTour.allDone()) {
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
            this.router.transitionTo(this.autostartTour.routeOfNextTour);
          }
        };

        later(this, () => {
          this.tour.start();
        });
      });
    }
  }
}
