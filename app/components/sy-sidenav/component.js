import Component from '@ember/component'
import { inject as service } from '@ember/service'
import { oneWay } from 'ember-computed-decorators'

export default Component.extend({
  tagName: 'nav',
  classNames: ['nav-side'],
  classNameBindings: ['expand:nav-side--expand'],

  session: service('session'),
  @oneWay('session.data.user') user: null,

  expand: false
})
