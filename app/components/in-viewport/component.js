import Component from '@ember/component'

const InViewportComponent = Component.extend({
  rootSelector: 'body',
  rootMargin: 0,

  _observer: null,

  didInsertElement() {
    this._super(...arguments)

    let observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          return this.getWithDefault('on-enter-viewport', () => {})()
        }

        return this.getWithDefault('on-exit-viewport', () => {})()
      },
      {
        root: document.querySelector(this.get('rootSelector')),
        rootMargin: `${this.get('rootMargin')}px`
      }
    )

    this.set('_observer', observer)

    // eslint-disable-next-line ember/no-observers
    observer.observe(this.get('element'))
  },

  willDestroyElement() {
    this._super(...arguments)

    this.get('_observer').disconnect()
  }
})

export default InViewportComponent
