/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The actions for the tracking bar component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Start tracking the activity
     *
     * @method start
     * @public
     */
    start() {
      this.get('attrs.on-start')(this.get('activity'))
    },

    /**
     * Stop tracking the activity
     *
     * @method stop
     * @public
     */
    stop() {
      this.get('attrs.on-stop')(this.get('activity'))
    }
  }
})
