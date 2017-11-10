import Component from '@ember/component'
import { inject as service } from '@ember/service'

export default Component.extend({
  tagName: 'nav',
  classNames: ['nav-top', 'nav-top--fixed'],
  classNameBindings: ['expand:nav-top--expand'],
  session: service('session'),
  expand: false
})
