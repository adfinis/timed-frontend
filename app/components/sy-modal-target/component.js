/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'

/**
 * Target component for the sy modal
 *
 * @class SyModalTargetComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The id of the container. This is the wormhole target.
   *
   * @property {String} elementId
   * @public
   */
  elementId: 'sy-modals'
})
