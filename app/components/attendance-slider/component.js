/* global RangeBar */

import Component    from 'ember-component'
import { debounce } from 'ember-runloop'
import moment       from 'moment'

import computed, {
  observes
} from 'ember-computed-decorators'

export default Component.extend({
  classNameBindings: [ 'loading:loading-mask' ],

  saveDelay: 2000,

  bar: null,

  date: moment(),

  attendances: [],

  initBar() {
    let date = this.get('date')

    let bar = new RangeBar({
      min: moment(date).startOf('day'),
      max: moment(date).startOf('day').add(1, 'days'),
      valueFormat(value) {
        return moment(value).format('HH:mm')
      },
      valueParse(value) {
        return moment(value).valueOf()
      },
      values: [],
      label(a) {
        let start = moment(a[0], 'HH:mm')
        let end   = moment(a[1], 'HH:mm')
        let diff  = end.diff(start)

        if (diff < 0) {
          diff = 24 * 60 * 60 * 1000 + diff
        }
        else if (diff === 0) {
          diff = 24 * 60 * 60 * 1000
        }

        let dur = moment.duration(diff, 'milliseconds')

        if (dur.asHours() >= 1.5) {
          return `
            <span class="elessar-from">${a[0]}</span>
            <span class="elessar-duration">${dur.asHours()}h</span>
            <span class="elessar-to">${a[1]}</span>
            <span class="elessar-delete" title="Delete attendance">&times;</span>
          `
        }

        return `
          <span class="elessar-duration">${dur.asHours()}h</span>
          <span class="elessar-delete" title="Delete attendance">&times;</span>
        `
      },
      snap: 1000 * 60 * 15,
      minSize: 1000 * 60 * 30,
      bgMark: {
        count: 24,
        showLast: true
      },
      allowDelete: true,
      htmlLabel: true
    })

    bar.on('change', (e, values) => {
      if (!values) {
        return
      }

      debounce(this, this.attrs['on-change'], values, this.get('saveDelay'))
    })

    bar.val(this.get('attendanceValues'))

    this.set('bar', bar)

    this.$().append(bar.$el)
  },

  didInsertElement() {
    this.initBar()
  },

  @computed('attendances.[]')
  attendanceValues(attendances) {
    return attendances.map((a) => {
      return [ a.get('from').valueOf(), a.get('to').valueOf() ]
    })
  },

  @observes('date')
  _reinitBar() {
    this.get('bar').$el.remove()
    this.set('bar', null)

    this.initBar()
  },

  @observes('attendanceValues.[]')
  _updateBar() {
    let barValues = this.get('bar').val()
    let attValues = this.get('attendanceValues')

    if (attValues !== barValues) {
      this.get('bar').val(attValues)
    }
  }
})
