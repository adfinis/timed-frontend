import Component from '@ember/component'

export default Component.extend({
  classNames: ['filter-sidebar-group'],
  classNameBindings: ['expanded:filter-sidebar-group--expanded'],
  expanded: false
})
