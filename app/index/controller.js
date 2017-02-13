/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import moment     from 'moment'
import computed   from 'ember-computed-decorators'

/**
 * The index controller
 *
 * @class IndexController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  /**
   * The query params
   *
   * @property {String[]} queryParams
   * @public
   */
  queryParams: [ 'day' ],

  /**
   * The date format for the query param `day`
   *
   * @property {String} dateFormat
   * @public
   */
  dateFormat: 'YYYY-MM-DD',

  /**
   * The day
   *
   * @property {String} _day
   * @public
   */
  day: moment().format('YYYY-MM-DD'),

  /**
   * The day as a moment object
   *
   * @property {moment} date
   * @public
   */
  /* eslint-disable object-literal-jsdoc/obj-doc */
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
  /* eslint-enable object-literal-jsdoc/obj-doc */

  /**
   * All activities
   *
   * @property {Activity[]} _activities
   * @private
   */
  @computed
  _activities() {
    return this.store.peekAll('activity')
  },

  /**
   * All activities filtered by date
   *
   * @property {Activity[]} activities
   * @public
   */
  @computed('date', '_activities.[]')
  activities(date, activities) {
    return activities.filter((a) => {
      return a.get('start').isSame(date, 'day')
    })
  },

  /**
   * All attendances
   *
   * @property {Attendance[]} _attendance
   * @private
   */
  @computed
  _attendances() {
    return this.store.peekAll('attendance')
  },

  /**
   * All attendances filtered by date
   *
   * @property {Attendance[]} attendances
   * @public
   */
  @computed('date', '_attendances.[]')
  attendances(date, attendances) {
    return attendances.filter((a) => {
      return a.get('from').isSame(date, 'day')
    })
  }
})
