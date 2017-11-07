import SyDurationpickerComponent from 'timed/components/sy-durationpicker/component'
import moment from 'moment'

export default SyDurationpickerComponent.extend({
  maxlength: 5,

  max: moment.duration({ h: 24, m: 0 }),

  min: moment.duration({ h: 0, m: 0 }),

  sanitize(value) {
    return value.replace(/[^\d:]/, '')
  }
})
