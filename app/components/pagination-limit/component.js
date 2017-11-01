import Component from '@ember/component'

export default Component.extend({
  /**
   * CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ['pagination-limit'],

  /**
   * The selectable page limits
   *
   * @property {Number[]} limits
   * @public
   */
  limits: [10, 20, 50, 100]
})
