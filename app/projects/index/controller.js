import Controller          from 'ember-controller'
import ListControllerMixin from 'timed/mixins/list-controller'
import { observes }        from 'ember-computed-decorators'

export default Controller.extend(ListControllerMixin, {
  queryParams: [ 'customer' ],

  search: '',

  @observes('selectedCustomer')
  _updateCustomer() {
    this.set('customer', this.get('selectedCustomer.id'))
  }
})
