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
  }
})
