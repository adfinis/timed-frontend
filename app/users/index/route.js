import Route from '@ember/routing/route'

/**
 * Route for the user list
 *
 * @class UserIndexRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The query parameters
   *
   * @property {Object} queryParams
   * @public
   */
  queryParams: {
    supervisor: { refreshModel: true },
    active: { refreshModel: true },
    search: { refreshModel: true },
    ordering: { refreshModel: true },
    page: { refreshModel: true },
    page_size: { refreshModel: true } // eslint-disable-line camelcase
  },

  /**
   * Before model hook, fetch supervisor if selected
   *
   * @method beforeModel
   * @param {Ember.Transition} transition The transition
   * @public
   */
  async beforeModel({ queryParams: { supervisor } }) {
    if (supervisor) {
      await this.store.findRecord('user', supervisor)
    }
  },

  /**
   * Model hook, fetch the users
   *
   * A superuser can see all, however a staff member can only see his supervisees
   *
   * @method model
   * @param {Object} params The query parameters
   * @return {User[]} The users
   * @public
   */
  model(params) {
    let user = this.modelFor('protected')

    if (!user.get('isSuperuser')) {
      params = { ...params, supervisor: user.id }
    }

    return this.store.query('user', { ...params, include: 'employments' })
  }
})
