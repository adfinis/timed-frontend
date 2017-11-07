import Component from '@ember/component'
import computed from 'ember-computed-decorators'
import moment from 'moment'

const DISPLAY_FORMAT = 'DD.MM.YYYY'

const PARSE_FORMAT = 'D.M.YYYY'

const parse = value => (value ? moment(value, PARSE_FORMAT) : null)

export default Component.extend({
  tagName: '',

  value: null,

  placeholder: DISPLAY_FORMAT,

  @computed('value')
  displayValue(value) {
    return value && value.isValid() ? value.format(DISPLAY_FORMAT) : null
  },

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

    handleInput({ target }) {
      let parsed = parse(target.value)

      if (!parsed.isValid()) {
        target.setCustomValidity('Invalid date')
      } else {
        target.setCustomValidity('')
      }
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
