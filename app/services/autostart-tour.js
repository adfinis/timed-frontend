import Service from 'ember-service'
import computed from 'ember-computed-decorators'

export default Service.extend({
  doneKey: 'timed-tour',

  tours: [
    'index.activities',
    'index.activities.edit',
    'index.attendances',
    'index.reports'
  ],

  @computed()
  done: {
    get() {
      return Array.from(
        JSON.parse(localStorage.getItem(this.get('doneKey'))) || []
      )
    },
    set(value = []) {
      localStorage.setItem(this.get('doneKey'), JSON.stringify(value))

      return value
    }
  },

  allDone() {
    let all = this.get('tours')
    let done = this.get('done')

    return !all.filter(i => !done.includes(i)).length
  }
})
