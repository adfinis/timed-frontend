import Component       from 'ember-component'
import computed        from 'ember-computed-decorators'
import moment          from 'moment'
import formatDuration  from 'timed/utils/format-duration'
import { padStartTpl } from 'ember-pad/utils/pad'

const formatter = {
  to(value) {
    return moment({ hour: 0 }).minute(value).format('HH:mm')
  }
}

const padTpl2 = padStartTpl(2)

export default Component.extend({
  attendance: null,

  tooltips: [ formatter, formatter ],

  values: [ 0, 0 ],

  init() {
    this._super(...arguments)

    this.set('values', this.get('start'))
  },

  @computed('attendance.{from,to}')
  start(from, to) {
    return [
      from.hour() * 60 + from.minute(),
      to.hour() * 60 + to.minute()
    ]
  },

  @computed('values')
  duration([ fromMin, toMin ]) {
    let from = moment({ hour: 0 }).minute(fromMin)
    let to   = moment({ hour: 0 }).minute(toMin)

    return formatDuration(moment.duration(to.diff(from)), false)
  },

  @computed
  labels() {
    let labels = []

    for (let h = 0; h <= 24; h++) {
      for (let m = 0; m <= 30 && !(h === 24 && m === 30); m += 30) {
        labels.push({
          value: padTpl2`${h}:${m}`,
          size: m === 0 ? 'lg' : 'sm'
        })
      }
    }

    return labels
  },

  actions: {
    slide(values) {
      this.set('values', values)
    },

    save([ fromMin, toMin ]) {
      let action = this.get('attrs.on-save')

      if (!action) {
        throw new Error('The `on-save` action is missing!')
      }

      this.set('attendance.from', moment({ hour: 0 }).minute(fromMin))
      this.set('attendance.to', moment({ hour: 0 }).minute(toMin))

      action(this.get('attendance'))
    },

    delete() {
      let action = this.get('attrs.on-delete')

      if (!action) {
        throw new Error('The `on-delete` action is missing!')
      }

      action(this.get('attendance'))
    }
  }
})
