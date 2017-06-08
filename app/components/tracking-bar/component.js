/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import service   from 'ember-service/inject'

const ENTER_CHAR_CODE = 13

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  keyPress(e) {
    if (e.charCode === ENTER_CHAR_CODE && !e.target.classList.contains('tt-input')) {
      this.send('start')
    }
  },

  tracking: service('tracking')
})
