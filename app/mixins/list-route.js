import Mixin from 'ember-metal/mixin'

export default Mixin.create({
  queryParams: {
    sort:   { refreshModel: true },
    search: { refreshModel: true },
    page:   { refreshModel: true }
  },

  modelName: '',

  include: '',

  model(params) {
    let include = this.get('include')

    return this.store.query(this.get('modelName'), { include, ...params })
  },

  actions: {
    loading(transition, route) {
      if (route.controller) {
        route.controller.set('loading', true)

        transition.promise.finally(() => {
          route.controller.set('loading', false)
        })
      }
    },

    clearFilter() {
      this.get('controller').setProperties({
        search: ''
      })
    }
  }
})
