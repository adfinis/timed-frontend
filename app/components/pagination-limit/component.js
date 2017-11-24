import Component from '@ember/component'

export default Component.extend({
  /**
   * CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ['pagination-limit'],

  init() {
    this._super(...arguments)

    this.set('limits', [10, 20, 50, 100])
  }
})
