/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import ReportValidations from 'timed/validations/report'
import Changeset from 'ember-changeset'
import computed, { observes } from 'ember-computed-decorators'
import { later } from 'ember-runloop'

const ENTER_CHAR_CODE = 13

/**
 * Component for the editable report row
 *
 * @class ReportRowComponent
 * @extends Ember.Component
 * @public
 */
const ReportRowComponent = Component.extend({
  /**
   * The element tag name
   *
   * @property {String} tagName
   * @public
   */
  tagName: 'tr',

  /**
   * The changeset to edit
   *
   * @property {EmberChangeset.Changeset} changeset
   * @public
   */
  @computed('report.{id,verifiedBy}')
  changeset() {
    return new Changeset(this.get('report'), ReportValidations)
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
  @observes('changeset.task')
  _setCommentFocus() {
    later(this, () => {
      if (this.get('changeset.task.id')) {
        this.$('input[name=comment]').focus()
      }
    })
  },

  /**
   * Key press event, save the row
   *
   * @event keyPress
   * @param {jQuery.Event} e The jquery event
   * @public
   */
  keyPress(e) {
    if (e.which === ENTER_CHAR_CODE && !e.target.classList.contains('btn')) {
      this.send('save')
    }
  },

  actions: {
    /**
     * Save the row
     *
     * @method save
     * @public
     */
    save() {
      this.get('on-save')(this.get('changeset'))
    },

    /**
     * Delete the row
     *
     * @method delete
     * @public
     */
    delete() {
      this.get('on-delete')(this.get('report'))
    }
  }
})

ReportRowComponent.reopenClass({
  positionalParams: ['report']
})

export default ReportRowComponent
