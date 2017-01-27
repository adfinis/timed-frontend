import Mixin from 'ember-metal/mixin'

export default Mixin.create({
  queryParams: {
    sort: { refreshModel: true },
    search: { refreshModel: true },
    page: { refreshModel: true }
  },

  modelName: '',

  include: '',

  model(params) {
    let include = this.get('include')

    return this.store.query(this.get('modelName'), { include, ...params })
  },

  actions: {
    clearFilter() {
      this.get('controller').setProperties({
        search: ''
      })
    }
  }
})
