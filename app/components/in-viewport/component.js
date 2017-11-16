import Component from '@ember/component'
import InViewportMixin from 'ember-in-viewport'
import { on } from 'ember-computed-decorators'

// We can ignore this in coverage since it's fully tested by ember-in-viewport

/* istanbul ignore next */
const InViewportComponent = Component.extend(InViewportMixin, {
  @on('didInsertElement')
  viewportOptionsOverride() {
    this.setProperties({
      viewportUseRAF: true,
      viewportSpy: true,
      viewportTolerance: {
        top: 100,
        bottom: 100,
        right: 0,
        left: 0
      }
    })
  },

  didEnterViewport() {
    this.getWithDefault('on-enter-viewport', () => {})()
  },

  didExitViewport() {
    this.getWithDefault('on-exit-viewport', () => {})()
  }
})

export default InViewportComponent
