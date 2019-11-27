import VerticalCollectionComponent from 'vertical-collection/components/vertical-collection/component'
import Ember from 'ember'

export default VerticalCollectionComponent.extend({
  init() {
    this._super(...arguments)
    this.set('renderAll', Ember.testing)
  }
})
