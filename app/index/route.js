/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import RSVP    from 'rsvp'
import moment  from 'moment'
import service from 'ember-service/inject'

const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * The index route
 *
 * @class IndexRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The query params
   *
   * @property {Object} queryParams
   * @property {Object} queryParams.day
   * @public
   */
  queryParams: {
    day: { refreshModel: true }
  },

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * Model hook, return the selected day as moment object
   *
   * @method model
   * @param {Object} params The query params
   * @param {String} params.day The selected day
   * @return {moment} The selected day as moment object
   * @public
   */
  model({ day }) {
    return moment(day, DATE_FORMAT)
  },

  /**
   * After model hook, fetch all activities, attendances and reports of the
   * selected day, toghether with necessary data related to them.
   *
   * @method afterModel
   * @param {moment} model The selected day
   * @return {RSVP.Promise} A promise which resolves after all data is fetched
   * @public
   */
  afterModel(model) {
    let user = this.get('session.data.authenticated.user_id')
    let day  = model.format(DATE_FORMAT)
    let from = moment(model).subtract(20, 'days').format(DATE_FORMAT)
    let to   = moment(model).add(10, 'days').format(DATE_FORMAT)
    let location = this.store.peekRecord('user', user).get('activeEmployment.location.id')

    return RSVP.all([
      this.store.query('activity', { include: 'blocks,task,task.project,task.project.customer', day }),
      this.store.query('attendance', { day }),
      this.store.query('absence-type', {}),
      this.store.query('report', { include: 'task,task.project,task.project.customer', date: day, user }),
      this.store.query('report', { 'from_date': from, 'to_date': to, user }),
      this.store.query('absence', { 'from_date': from, 'to_date': to }),
      this.store.query('public-holiday', { 'from_date': from, 'to_date': to, location })
    ])
  },

  setupController(controller) {
    this._super(...arguments)

    controller.set('user', this.modelFor('protected'))
  },

  actions: {
    /**
     * Edit an existing absence
     *
     * @method editAbsence
     * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
     * @public
     */
    async saveAbsence(changeset) {
      try {
        this.send('loading')

        await changeset.save()

        this.set('controller.showEditModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the absence')
      }
      finally {
        this.send('finished')
      }
    },

    /**
     * Delete an absence
     *
     * @method deleteAbsence
     * @param {Absence} absence The absence to delete
     * @public
     */
    async deleteAbsence(absence) {
      try {
        this.send('loading')

        await absence.destroyRecord()
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the absence')
      }
      finally {
        this.send('finished')
      }
    },

    /**
     * Add one or more absences
     *
     * @method addAbsence
     * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
     * @public
     */
    async addAbsence(changeset) {
      try {
        let type    = changeset.get('type')
        let comment = changeset.get('comment')

        changeset.get('dates').forEach(async(date) => {
          let absence = this.store.createRecord('absence', { type, date, comment })

          await absence.save()
        })

        this.set('controller.showAddModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while adding the absence')
      }
      finally {
        this.send('finished')
      }
    }
  }
})
