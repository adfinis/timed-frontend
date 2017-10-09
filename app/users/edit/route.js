import Route from '@ember/routing/route'

/**
 * User edit route
 *
 * @class UserEditRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * Model hook, fetch the user and the needed relations
   *
   * @method model
   * @param {Object} params The filter parameters
   * @return {User} The user to edit
   * @public
   */
  model({ id }) {
    return this.store.findRecord('user', id, {
      reload: true,
      include:
        'employments,user_absence_types,user_absence_types.absence_credits,supervisors,supervisees'
    })
  },

  /**
   * After model hook, check if the current user is a superuser or a supervisor
   * of the user to edit, if not transition away.
   *
   * @method afterModel
   * @param {User} model The user to edit
   * @public
   */
  afterModel(model) {
    let user = this.modelFor('protected')

    if (
      !user.get('isSuperuser') &&
      !model
        .get('supervisors')
        .mapBy('id')
        .includes(user.id)
    ) {
      this.replaceWith('users')
    }
  }
})
