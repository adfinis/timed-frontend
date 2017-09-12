/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from 'ember-metal/mixin'

/**
 * Mixin to prevent mobile devices to access the page
 *
 * @class DesktopOnlyRouteMixin
 * @extends Ember.Mixin
 * @public
 */
export default Mixin.create({
  /**
   * Before model hook, ensure the device is large enough. If this isn't the case redirect to index page.
   *
   * @method beforeModel
   * @param {Ember.Transition} transition The transition
   * @return {*} The return value of the parent function or a new transition
   * @public
   */
  beforeModel(transition) {
    if (
      Object.values(
        this.getProperties('media.isMd', 'media.isLg', 'media.isXl')
      ).some(i => i)
    ) {
      return this._super(...arguments)
    }

    transition.abort()

    return this.replaceWith('index')
  }
})
