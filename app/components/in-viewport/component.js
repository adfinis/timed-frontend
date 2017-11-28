import Component from '@ember/component'
import { on } from 'ember-computed-decorators'

const InViewportComponent = Component.extend({
  rootSelector: 'body',
  rootMargin: 0,

  @on('didInsertElement')
  initIntersectionObserver() {
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

    // eslint-disable-next-line ember/no-observers
    observer.observe(this.get('element'))
  }
})

export default InViewportComponent
