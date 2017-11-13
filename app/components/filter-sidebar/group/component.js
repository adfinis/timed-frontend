import Component from '@ember/component'
import { cancel, later } from '@ember/runloop'

export default Component.extend({
  classNames: ['filter-sidebar-group'],
  classNameBindings: ['expanded:filter-sidebar-group--expanded'],
  expanded: false,

  _setHeight() {
    let body = this.get('element').querySelector('.filter-sidebar-group-body')

    body.style['max-height'] = `${this.get('expanded')
      ? body.scrollHeight
      : 0}px`
  },

  didInsertElement() {
    this._super(...arguments)

    this.set(
      '_initTimer',
      later(() => {
        this._setHeight()
      }, 100)
    )

    window.addEventListener('resize', this._setHeight)
  },

  willDestroyElement() {
    cancel(this.get('_initTimer'))

    window.removeEventListener('resize', this._setHeight)
  },

  actions: {
    toggle() {
      this.toggleProperty('expanded')

      this._setHeight()
    }
  }
})
