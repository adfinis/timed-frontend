/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component         from 'ember-component'
import ReportValidations from 'timed/validations/report'
import Changeset         from 'ember-changeset'

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
   * Init hook, create the changeset
   *
   * @method init
   * @public
   */
  init() {
    this._super(...arguments)

    this.set('changeset', new Changeset(this.get('report'), ReportValidations))
  },

  /**
   * Key press event, save the row
   *
   * @event keyPress
   * @param {jQuery.Event} e The jquery event
   * @public
   */
  keyPress(e) {
    if (e.charCode === ENTER_CHAR_CODE && !e.target.classList.contains('tt-input')) {
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
  positionalParams: [ 'report' ]
})

export default ReportRowComponent
