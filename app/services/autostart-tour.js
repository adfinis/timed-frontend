import Service from 'ember-service'
import computed from 'ember-computed-decorators'

/**
 * Autostart tour service
 *
 * This service helps connecting the tours to the localstorage
 *
 * @class AutostartTourService
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  /**
   * The item key to use in the localstorage
   *
   * @property {String} doneKey
   * @public
   */
  doneKey: 'timed-tour',

  /**
   * All available tours
   *
   * @property {String[]} tours
   * @public
   */
  tours: [
    'index.activities',
    'index.activities.edit',
    'index.attendances',
    'index.reports'
  ],

  /**
   * All done tours
   *
   * @property {String[]} done
   * @public
   */
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

  /**
   * Whether all tours are done
   *
   * @method allDone
   * @return {Boolean} Whether all tours are done
   * @public
   */
  allDone() {
    let all = this.get('tours')
    let done = this.get('done')

    return !all.filter(i => !done.includes(i)).length
  }
})
