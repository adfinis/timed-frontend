/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component          from 'ember-component'
import AbsenceValidations from 'timed/validations/absence'

/**
 * Custom modal for editing absences
 *
 * @class EditAbsenceModalComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Whether the modal is currently visible
   *
   * @property {Boolean} visible
   * @public
   */
  visible: true,

  /**
   * Validator for the changeset
   *
   * @property {Object} validator
   * @public
   */
  validator: AbsenceValidations,

  /**
   * Actions for the component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Close the modal and rollback the changes
     *
     * @method close
     * @param {Changeset} changeset The changeset to rollback
     * @public
     */
    close(changeset) {
      changeset.rollback()

      this.set('visible', false)

      this.get('attrs.on-close')()
    },

    /**
     * Validate the changeset and save if valid
     *
     * @method save
     * @param {Changeset} changeset The changeset to save
     * @public
     */
    save(changeset) {
      changeset.validate()

      if (changeset.get('isValid')) {
        changeset.execute()

        this.send('close', changeset)

        this.get('attrs.on-save')(this.get('model'))
      }
    },

    /**
     * Delete the absence
     *
     * @method delete
     * @param {Changeset} changeset The changeset to delete
     * @public
     */
    delete(changeset) {
      this.send('close', changeset)

      this.get('attrs.on-delete')(this.get('model'))
    }
  }
})
