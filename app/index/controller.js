/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller        from 'ember-controller'
import moment            from 'moment'
import computed          from 'ember-computed-decorators'
import Ember             from 'ember'
import service           from 'ember-service/inject'
import { task, timeout } from 'ember-concurrency'

const { testing } = Ember

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
  @computed('date', '_allActivities.@each.{start,isDeleted}')
  _activities(day, activities) {
    return activities.filter((a) => {
      return a.get('start').isSame(day, 'day') && !a.get('isDeleted')
    })
  },

  /**
   * The duration sum of all activities of the selected day
   *
   * @property {moment.duration} activitySum
   * @public
   */
  activitySum: moment.duration(),

  /**
   * Compute the current activity sum
   *
   * @method _activitySum
   * @private
   */
  _activitySum: task(function* () {
    for (;;) {
      let duration = this.get('_activities').reduce((dur, cur) => {
        dur.add(cur.get('duration'))

        if (cur.get('activeBlock')) {
          dur.add(moment().diff(cur.get('activeBlock.from')), 'milliseconds')
        }

        return dur
      }, moment.duration())

      this.set('activitySum', duration)

      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      yield timeout(1000)
    }
  }).on('init'),

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
  @computed('date', '_allAttendances.@each.{from,isDeleted}')
  _attendances(day, attendances) {
    return attendances.filter((a) => {
      return a.get('from').isSame(day, 'day') && !a.get('isDeleted')
    })
  },

  /**
   * The duration sum of all attendances of the selected day
   *
   * @property {moment.duration} attendanceSum
   * @public
   */
  @computed('_attendances.@each.{from,to}')
  attendanceSum(attendances) {
    return attendances.reduce((dur, cur) => {
      return dur.add(cur.get('to').diff(cur.get('from')), 'milliseconds')
    }, moment.duration())
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
   * All absences
   *
   * @property {Absence[]} _allAbsences
   * @private
   */
  @computed()
  _allAbsences() {
    return this.store.peekAll('absence')
  },

  /**
   * All reports filtered by the selected day
   *
   * @property {Report[]} _reports
   * @private
   */
  @computed('date', '_allReports.@each.{date,isNew,isDeleted}')
  _reports(day, reports) {
    return reports.filter((r) => {
      return r.get('date').isSame(day, 'day') && !r.get('isNew') && !r.get('isDeleted')
    })
  },

  /**
   * All absences filtered by the selected day
   *
   * @property {Absence[]} _absences
   * @private
   */
  @computed('date', '_allAbsences.@each.{date,isNew,isDeleted}')
  _absences(day, absences) {
    return absences.filter((a) => {
      return a.get('date').isSame(day, 'day') && !a.get('isNew') && !a.get('isDeleted')
    })
  },

  /**
   * The duration sum of all reports of the selected day
   *
   * @property {moment.duration} reportSum
   * @public
   */
  @computed('_reports.@each.duration', '_absences.@each.duration')
  reportSum(reports, absences) {
    let reportDurations  = reports.mapBy('duration')
    let absenceDurations = absences.mapBy('duration')

    return [ ...reportDurations, ...absenceDurations ].reduce((val, dur) => val.add(dur), moment.duration())
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
    set(value) {
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
   * The workdays for the location related to the users active employment
   *
   * @property {Number[]} workdays
   * @public
   */
  @computed('session.data.authenticated.user_id')
  workdays(userId) {
    return this.store.peekRecord('user', userId).get('activeEmployment.location.workdays')
  },

  /**
   * The data for the weekly overview
   *
   * @property {Object[]} weeklyOverviewData
   * @public
   */
  @computed('_allReports.@each.{duration,date}', '_allAbsences.@each.{duration,date}', 'date')
  weeklyOverviewData(allReports, allAbsences, date) {
    let task = this.get('_weeklyOverviewData')

    task.perform(allReports, allAbsences, date)

    return task
  },

  /**
   * The task to compute the data for the weekly overview
   *
   * @property {EmberConcurrency.Task} _weeklyOverviewData
   * @private
   */
  _weeklyOverviewData: task(function* (allReports, allAbsences, date) {
    yield timeout(200)

    allReports  = allReports.filter((r)  => !r.get('isDeleted') && !r.get('isNew'))
    allAbsences = allAbsences.filter((a) => !a.get('isDeleted') && !a.get('isNew'))

    let container = [ ...allReports, ...allAbsences ].reduce((obj, model) => {
      let d = model.get('date').format('YYYY-MM-DD')

      obj[d] = obj[d] || { reports: [], absences: [] }

      obj[d][`${model.constructor.modelName}s`].push(model.get('duration'))

      return obj
    }, {})

    return Array.from({ length: 31 }, (v, k) => moment(date).add(k - 20, 'days')).map((d) => {
      let { reports = [], absences = [] } = container[d.format('YYYY-MM-DD')] || {}

      return {
        day: d,
        active: d.isSame(date, 'day'),
        absence: !!absences.length,
        workday: this.get('workdays').includes(d.isoWeekday()),
        worktime: [ ...reports, ...absences ].reduce((val, dur) => val.add(dur), moment.duration())
      }
    })
  }).restartable()
})
