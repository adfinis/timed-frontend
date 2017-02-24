import FaIconComponent from 'ember-font-awesome/components/fa-icon'

export default FaIconComponent.extend({
  click(e) {
    e.stopPropagation()

    this.get('attrs.on-click')()
  }
})
