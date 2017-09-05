import FaIconComponent from 'ember-font-awesome/components/fa-icon'
import computed from 'ember-computed-decorators'

export default FaIconComponent.extend({
  checked: false,

  @computed('checked')
  icon(checked) {
    return checked ? 'check-square-o' : 'square-o'
  }
})
