import Component from '@ember/component'

export default Component.extend({
  tagName: '',

  visible: false,

  didInsertElement() {
    this._super(...arguments)

    this.set('destination', document.getElementById('filter-sidebar-target'))
  }
})
