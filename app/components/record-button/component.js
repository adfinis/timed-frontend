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
  classNameBindings: [ 'recording', 'ready' ],

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
     * Start recording
     *
     * @method start
     * @public
     */
    start() {
      this.get('attrs.on-start')()
    },

    /**
     * Stop recording
     *
     * @method stop
     * @public
     */
    stop() {
      this.get('attrs.on-stop')()
    }
  }
})
