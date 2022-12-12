import Component from "@ember/component";
import { get } from "@ember/object";
import classic from "ember-classic-decorator";

@classic
class InViewportComponent extends Component {
  rootSelector = "body";
  rootMargin = 0;
  _observer = null;

  didInsertElement(...args) {
    super.didInsertElement(...args);

    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          return (get(this, "on-enter-viewport") ?? (() => {}))();
        }

        return (get(this, "on-exit-viewport") ?? (() => {}))();
      },
      {
        root: document.querySelector(this.rootSelector),
        rootMargin: `${this.rootMargin}px`,
      }
    );

    this.set("_observer", observer);

    // eslint-disable-next-line ember/no-observers
    observer.observe(this.element);
  }

  willDestroyElement(...args) {
    super.willDestroyElement(...args);

    this._observer.disconnect();
  }
}

export default InViewportComponent;
