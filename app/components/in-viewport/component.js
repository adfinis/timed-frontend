import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class InViewport extends Component {
  @tracked rootSelector = "body";
  @tracked rootMargin = 0;
  _observer = null;

  @action
  registerObserver(element) {
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          return (this.args["on-enter-viewport"] ?? (() => {}))();
        }

        return (this.args["on-exit-viewport"] ?? (() => {}))();
      },
      {
        root: document.querySelector(this.rootSelector),
        rootMargin: `${this.rootMargin}px`,
      }
    );

    this._observer = observer;

    // eslint-disable-next-line ember/no-observers
    observer.observe(element);
  }

  @action
  willDestroy(...args) {
    super.willDestroy(...args);
    this._observer?.disconnect();
  }
}
