import PowerSelectComponent from 'ember-power-select/components/power-select'
import Ember from 'ember'
import $ from 'jquery'

const { isBlank, testing } = Ember

export default PowerSelectComponent.extend({
  init() {
    this._super(...arguments)

    this.set('extra.testing', testing)
  },

  _handleKeyTab() {
    this._handleKeyEnter(...arguments)
  },

  _focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget

    if (isBlank(blurredEl) || testing) {
      return false
    }

    // Can't test this since dropdowns are rendered in place in tests
    /* istanbul ignore next */
    return !blurredEl.classList.contains('ember-power-select-search-input')
  },

  actions: {
    onTriggerFocus(_, e) {
      this._super(...arguments)

      /* istanbul ignore next */
      if (this._focusComesFromOutside(e)) {
        this.get('publicAPI.actions').open()
      }
    },

    scrollTo() {
      let options = $(
        `#ember-power-select-options-${this.get('publicAPI').uniqueId}`
      )

      let current = options.find('[aria-current=true]')

      if (!current.length) {
        return
      }

      let currentScrollY = options.scrollTop()
      let { top } = current.position()
      let bottomOfOption = top + current.height()

      /* istanbul ignore next */
      if (bottomOfOption > currentScrollY + options.height()) {
        options.scrollTop(bottomOfOption - options.height())
      } else if (top < currentScrollY) {
        options.scrollTop(top)
      }
    }
  }
})
