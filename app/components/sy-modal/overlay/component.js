/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'

/**
 * Overlay component for sy modal
 *
 * @class SyModalOverlayComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * CSS classes
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ['modal'],

  /**
   * Classes which are bound to a property
   *
   * @property {String[]} classNameBindings
   * @public
   */
  classNameBindings: ['visible:modal--visible'],

  /**
   * Close the modal if the user clicks on the overlay, not a child of it
   *
   * @event click
   * @param {jQuery.Event} e The jquery click event
   * @public
   */
  click(e) {
    if (e.target === this.get('element')) {
      this.get('attrs.on-close')()
    }
  }
})
