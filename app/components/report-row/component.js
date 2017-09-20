/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import ReportValidations from 'timed/validations/report'
import Changeset from 'ember-changeset'
import lookupValidator from 'ember-changeset-validations'
import computed from 'ember-computed-decorators'

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
  tagName: 'form',

  /**
   * CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ['form-list-row'],

  /**
   * The changeset to edit
   *
   * @property {EmberChangeset.Changeset} changeset
   * @public
   */
  @computed('report.{id,verifiedBy}')
  changeset() {
    let c = new Changeset(
      this.get('report'),
      lookupValidator(ReportValidations),
      ReportValidations
    )

    c.validate()

    return c
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
