/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import moment from 'moment'

/**
 * The record button component
 *
 * @class RecordButtonComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Class name bindings
   *
   * @property {String[]} classNameBindings
   * @public
   */
  classNameBindings: [ 'recording', 'paused', 'ready' ],

  /**
   * The start time
   *
   * @property {moment} startTime
   * @public
   */
  startTime: moment(),

  /**
   * Whether it is currently recording
   *
   * @property {Boolean} recording
   * @public
   */
  recording: false,

  /**
   * Whether it is currently paused
   *
   * @property {Boolean} paused
   * @public
   */
  paused: false,

  /**
   * Whether it is ready
   *
   * @property {Boolean} ready
   * @public
   */
  ready: false,

  /**
   * The actions for the record button component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Start or pause recording
     *
     * @method startOrPause
     * @public
     */
    startOrPause() {
      let action = this.get('recording') ? 'pause' : 'start'

      this.get(`attrs.on-${action}`)()
    },

    /**
     * Stop recording
     *
     * @method startOrPause
     * @public
     */
    stop() {
      this.get('attrs.on-stop')()
    }
  }
})
