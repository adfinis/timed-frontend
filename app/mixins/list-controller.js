import Mixin        from 'ember-metal/mixin'
import { debounce } from 'ember-runloop'

export default Mixin.create({
  queryParams: [ 'sort', 'search', 'page', 'page_size' ],

  sort: '',

  search: '',

  page: 1,

  'page_size': 15,

  searchDelay: 500,

  _applyParam(key, value) {
    this.set(key, value)
  },

  actions: {
    updateParam(key, { target: { value } }) {
      debounce(this, this._applyParam, key, value, this.get('searchDelay'))
    }
  }
})
