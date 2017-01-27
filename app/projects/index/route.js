import Route          from 'ember-route'
import ListRouteMixin from 'timed/mixins/list-route'

export default Route.extend(ListRouteMixin, {
  queryParams: {
    customer: { refreshModel: true }
  },

  modelName: 'project',

  include: 'customer',

  beforeModel() {
    return this.store.findAll('customer')
  },

  setupController(controller) {
    this._super(...arguments)

    controller.set('customers', this.store.peekAll('customer'))
  },

  actions: {
    clearFilter() {
      this._super()

      this.get('controller').set('selectedCustomer', null)
    }
  }
})
