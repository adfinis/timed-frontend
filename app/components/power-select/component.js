import PowerSelectComponent from 'ember-power-select/components/power-select'
import Ember from 'ember'
import { isBlank } from '@ember/utils'

/* istanbul ignore next */
const PowerSelectCustomComponent = PowerSelectComponent.extend({
  init() {
    this._super(...arguments)

    this.set('extra.testing', Ember.testing)
  },

  _handleKeyTab() {
    this._handleKeyEnter(...arguments)
  },

  _focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget

    if (isBlank(blurredEl) || Ember.testing) {
      return false
    }

    return !blurredEl.classList.contains('ember-power-select-search-input')
  },

  actions: {
    onTriggerFocus(_, e) {
      this._super(...arguments)

      if (this._focusComesFromOutside(e)) {
        this.get('publicAPI.actions').open(e)
      }
    },

    onBlur(e) {
      this._super(...arguments)

      if (this._focusComesFromOutside(e)) {
        this.get('publicAPI.actions').close(e)
      }
    },

    scrollTo() {
      let options = document.querySelector(
        `#ember-power-select-options-${this.get('publicAPI').uniqueId}`
      )

      let current = options.querySelector('[aria-current=true]')

      if (!current) {
        return
      }

      let currentScrollY = options.scrollTop
      let top = current.offsetTop
      let bottomOfOption = top + current.offsetHeight

      if (bottomOfOption > currentScrollY + options.offsetHeight) {
        options.scrollTop = bottomOfOption - options.offsetHeight
      } else if (top < currentScrollY) {
        options.scrollTop = top
      }
    }
  }
})

export default PowerSelectCustomComponent
