import PowerSelectComponent from 'ember-power-select/components/power-select'
import Ember from 'ember'
import $ from 'jquery'

const { isBlank, testing } = Ember

/* istanbul ignore next */
const PowerSelectCustomComponent = PowerSelectComponent.extend({
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

      if (bottomOfOption > currentScrollY + options.height()) {
        options.scrollTop(bottomOfOption - options.height())
      } else if (top < currentScrollY) {
        options.scrollTop(top)
      }
    }
  }
})

export default PowerSelectCustomComponent
