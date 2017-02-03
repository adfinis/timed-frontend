import Controller from 'ember-controller'
import moment     from 'moment'
import computed   from 'ember-computed-decorators'

export default Controller.extend({
  dateFormat: 'YYYY-MM-DD',

  queryParams: [ 'day' ],

  day: moment().format('YYYY-MM-DD'),

  @computed('day')
  date: {
    get(day) {
      return moment(day, this.get('dateFormat'))
    },
    set(value) {
      this.set('day', value.format(this.get('dateFormat')))

      return value
    }
  },

  @computed
  _activities() {
    return this.store.peekAll('activity')
  },

  @computed('day', '_activities.[]')
  activities(day, activities) {
    return activities.filter((a) => {
      return a.get('start').format(this.get('dateFormat')) === day
    })
  },

  @computed
  _attendances() {
    return this.store.peekAll('attendance')
  },

  @computed('day', '_attendances.[]')
  attendances(day, attendances) {
    return attendances.filter((a) => {
      return a.get('from').format(this.get('dateFormat')) === day
    })
  }
})
