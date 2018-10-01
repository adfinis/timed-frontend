import FaIconComponent from 'ember-font-awesome/components/fa-icon'
import { computed } from '@ember/object'

export default FaIconComponent.extend({
  checked: false,

  icon: computed('checked', function() {
    return this.get('checked') ? 'check-square-o' : 'square-o'
  })
})
