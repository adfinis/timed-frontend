/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from 'ember-metal/mixin'

/**
 * Mixin to prevent non staff users to access the page
 *
 * @class StaffRouteMixin
 * @extends Ember.Mixin
 * @public
 */
export default Mixin.create({
  /**
   * Before model hook, ensure the user is a staff member. If this isn't the case redirect to index page.
   *
   * @method beforeModel
   * @param {Ember.Transition} transition The transition
   * @return {*} The return value of the parent function or a new transition
   * @public
   */
  beforeModel(transition) {
    if (this.modelFor('protected').get('isStaff')) {
      return this._super(...arguments)
    }

    transition.abort()

    return this.replaceWith('index')
  }
})
