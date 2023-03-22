import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class InViewport extends Component {
  @tracked rootSelector = "body";
  @tracked rootMargin = 0;
  @tracked onEnterViewport = this.args["on-enter-viewport"];
  @tracked onExitViewport = this.args["on-exit-viewport"];
  _observer = null;

  @action
  registerObserver(element) {
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          return (this.onEnterViewport ?? (() => {}))();
        }

        return (this.onExitViewport ?? (() => {}))();
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
  disconnectObserver() {
    this._observer.disconnect();
  }
}
