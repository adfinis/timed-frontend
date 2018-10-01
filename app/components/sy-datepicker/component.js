import Component from '@ember/component'
import { computed } from '@ember/object'
import moment from 'moment'
import { scheduleOnce } from '@ember/runloop'

const DISPLAY_FORMAT = 'DD.MM.YYYY'

const PARSE_FORMAT = 'D.M.YYYY'

const parse = value => (value ? moment(value, PARSE_FORMAT) : null)

export default Component.extend({
  value: null,

  placeholder: DISPLAY_FORMAT,

  displayValue: computed('value', function() {
    let value = this.get('value')
    return value && value.isValid() ? value.format(DISPLAY_FORMAT) : null
  }),

  name: 'date',

  actions: {
    handleBlur(dd, e) {
      if (
        !document
          .getElementById(`ember-basic-dropdown-content-${dd.uniqueId}`)
          .contains(e.relatedTarget)
      ) {
        dd.actions.close()
      }
    },

    handleFocus(dd) {
      dd.actions.open()
    },

    checkValidity() {
      scheduleOnce('afterRender', this, () => {
        let target = this.get('element').querySelector(
          '.ember-basic-dropdown-trigger input'
        )

        let parsed = parse(target.value)

        if (parsed && !parsed.isValid()) {
          return target.setCustomValidity('Invalid date')
        }

        return target.setCustomValidity('')
      })
    },

    handleChange({ target: { value, validity: { valid } } }) {
      if (valid) {
        let parsed = parse(value)

        return this.get('attrs.on-change')(
          parsed && parsed.isValid() ? parsed : null
        )
      }
    }
  }
})
