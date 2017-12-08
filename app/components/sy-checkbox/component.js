/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import computed from 'ember-computed-decorators'
import { scheduleOnce } from '@ember/runloop'

/**
 * Component for an adcssy styled checkbox
 *
 * @class SyCheckboxComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  @computed('elementId')
  checkboxElementId(id) {
    return `${id}-checkbox`
  },

  didReceiveAttrs() {
    scheduleOnce('afterRender', () => {
      if (this.get('checked') === null) {
        let cb = this.get('element').querySelector(
          `#${this.get('checkboxElementId')}`
        )

        cb.indeterminate = true
      }
    })
  },

  /**
   * The CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ['checkbox'],

  /**
   * Action to call if the checked state has changed
   *
   * @method on-change
   * @public
   */
  'on-change'() {},

  /**
   * The label of the checkbox
   *
   * @property {String} label
   * @public
   */
  label: '',

  /**
   * Whether the checkbox is checked
   *
   * @property {Boolean} checked
   * @public
   */
  checked: false,

  /**
   * Whether the checkbox is disabled
   *
   * @property {Boolean} disabled
   * @public
   */
  disabled: false
})
