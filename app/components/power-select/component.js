import PowerSelectComponent from 'ember-power-select/components/power-select'
import $ from 'jquery'

export default PowerSelectComponent.extend({
  _handleKeyTab() {
    this._handleKeyEnter(...arguments)
  },

  actions: {
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
