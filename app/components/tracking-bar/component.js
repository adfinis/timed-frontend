/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import service from 'ember-service/inject'
import { observes } from 'ember-computed-decorators'
import { later } from 'ember-runloop'

const ENTER_CHAR_CODE = 13

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  tracking: service('tracking'),

  /**
   * Key press event
   *
   * Start activity if the pressed key is enter
   *
   * @event keyPress
   * @param {jQuery.Event} e The keypress event
   * @public
   */
  keyPress(e) {
    if (
      e.which === ENTER_CHAR_CODE &&
      !e.target.classList.contains('tt-input')
    ) {
      this.get('tracking.startActivity').perform()
    }
  },

  /**
   * Set the focus to the comment field as soon as the task is selected
   *
   * The 'later' needs to be there so that the focus happens after all the
   * other events are done. Otherwise it'd focus the play button.
   *
   * @method _setCommentFocus
   * @public
   */
  @observes('tracking.activity.task')
  _setCommentFocus() {
    later(this, () => {
      if (this.get('tracking.activity.task.id')) {
        this.$('input[name=comment]').focus()
      }
    })
  }
})
