import Service from '@ember/service'
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
  init() {
    this._super(...arguments)

    this.set('tours', [
      'index.activities',
      'index.attendances',
      'index.reports'
    ])
  },

  /**
   * The item key to use in the localstorage
   *
   * @property {String} doneKey
   * @public
   */
  doneKey: 'timed-tour',

  /**
   * All done tours
   *
   * @property {String[]} done
   * @public
   */
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
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
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

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
