import Component from 'ember-component'

export default Component.extend({
  tagName: 'tbody',

  classNameBindings: [ 'loading:loading-mask' ]
})
