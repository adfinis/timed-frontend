/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed  from 'ember-computed-decorators'

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Whether the bar is ready to start tracking
   *
   * @property {Boolean} ready
   * @public
   */
  @computed('activity.task')
  ready(task) {
    return Boolean(task && task.get('content'))
  },

  /**
   * Whether the bar is currently recording
   *
   * @property {Boolean} recording
   * @public
   */
  @computed('ready', 'activity.active')
  recording(ready, active) {
    return ready && active
  },

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
