import Component from "@ember/component";

const InViewportComponent = Component.extend({
  rootSelector: "body",
  rootMargin: 0,

  _observer: null,

  didInsertElement(...args) {
    this._super(...args);

    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          return (
            this.get("on-enter-viewport") === undefined
              ? () => {}
              : this.get("on-enter-viewport")
          )();
        }

        return (
          this.get("on-exit-viewport") === undefined
            ? () => {}
            : this.get("on-exit-viewport")
        )();
      },
      {
        root: document.querySelector(this.get("rootSelector")),
        rootMargin: `${this.get("rootMargin")}px`,
      }
    );

    this.set("_observer", observer);

    // eslint-disable-next-line ember/no-observers
    observer.observe(this.get("element"));
  },

  willDestroyElement(...args) {
    this._super(...args);

    this.get("_observer").disconnect();
  },
});

export default InViewportComponent;
