/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import moment     from 'moment'
import computed   from 'ember-computed-decorators'
import { later }  from 'ember-runloop'
import Ember      from 'ember'
import service    from 'ember-service/inject'

const { testing } = Ember
const { floor } = Math

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
   * The day
   *
   * @property {String} _day
   * @public
   */
  day: moment().format('YYYY-MM-DD'),

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * All activities
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  @computed()
  _allActivities() {
    return this.store.peekAll('activity')
  },

  /**
   * All activities filtered by the selected day
   *
   * @property {Activity[]} _activities
   * @private
   */
  @computed('_allActivities.@each.{start,isDeleted}', 'model')
  _activities(activities, day) {
    return activities.filter((a) => {
      return a.get('start').isSame(day, 'day') && !a.get('isDeleted')
    })
  },

  /**
   * The duration sum of all activities of the selected day
   *
   * @property {String} activitySum
   * @public
   */
  @computed('_activities.@each.{duration,activeBlock}')
  activitySum(activities) {
    let duration = activities.reduce((dur, cur) => {
      dur.add(cur.get('duration'))

      if (cur.get('activeBlock')) {
        dur.add(moment().diff(cur.get('activeBlock.from')), 'milliseconds')

        /* istanbul ignore next */
        if (!testing) {
          later(() => {
            this.notifyPropertyChange('_activities')
          }, 1000)
        }
      }

      return dur
    }, moment.duration())

    return `${floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`
  },

  /**
   * All attendances
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  @computed()
  _allAttendances() {
    return this.store.peekAll('attendance')
  },

  /**
   * All attendances filtered by the selected day
   *
   * @property {Attendance[]} _attendances
   * @private
   */
  @computed('_allAttendances.@each.{from,isDeleted}', 'model')
  _attendances(attendances, day) {
    return attendances.filter((a) => {
      return a.get('from').isSame(day, 'day') && !a.get('isDeleted')
    })
  },

  /**
   * The duration sum of all attendances of the selected day
   *
   * @property {String} attendanceSum
   * @public
   */
  @computed('_attendances.@each.{from,to}')
  attendanceSum(attendances) {
    let duration = attendances.reduce((dur, cur) => {
      dur.add(cur.get('to').diff(cur.get('from')), 'milliseconds')

      return dur
    }, moment.duration())

    return `${floor(duration.asHours())}h ${duration.minutes()}m`
  },

  /**
   * All reports
   *
   * @property {Report[]} _allReports
   * @private
   */
  @computed()
  _allReports() {
    return this.store.peekAll('report')
  },

  /**
   * All reports filtered by the selected day
   *
   * @property {Report[]} _reports
   * @private
   */
  @computed('_allReports.@each.{date,isNew,isDeleted}', 'model')
  _reports(reports, day) {
    return reports.filter((r) => {
      return r.get('date').isSame(day, 'day') && !r.get('isNew') && !r.get('isDeleted')
    })
  },

  /**
   * The duration sum of all reports of the selected day
   *
   * @property {String} reportSum
   * @public
   */
  @computed('_reports.@each.duration')
  reportSum(reports) {
    let duration = reports.reduce((dur, cur) => {
      dur.add(cur.get('duration'))

      return dur
    }, moment.duration())

    return `${floor(duration.asHours())}h ${duration.minutes()}m`
  },

  /**
   * The day as a moment object
   *
   * @property {moment} date
   * @public
   */
  @computed('day')
  date: {
    get(day) {
      return moment(day, 'YYYY-MM-DD')
    },
    set(day, value) {
      this.set('day', value.format('YYYY-MM-DD'))

      return value
    }
  },

  /**
   * The expected worktime of the user
   *
   * @property {moment.duration} expectedWorktime
   * @public
   */
  @computed('session.data.authenticated.user_id')
  expectedWorktime(userId) {
    return this.store.peekRecord('user', userId).get('activeEmployment.worktimePerDay')
  },

  /**
   * The data for the weekly overview
   *
   * @property {Object[]} weeklyOverviewData
   * @public
   */
  @computed('_allReports.@each.{date,duration}', 'days.[]', 'date')
  weeklyOverviewData(reports, days, current) {
    return Array.from({ length: 31 }, (v, k) => moment(current).add(k - 20, 'days')).map((d) => {
      return {
        day: d,
        active: d.isSame(current, 'day'),
        worktime: reports.filter((r) => r.get('date').isSame(d, 'day')).reduce((val, cur) => {
          return val.add(cur.get('duration'))
        }, moment.duration())
      }
    })
  }
})
