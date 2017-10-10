import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  ajax: service('ajax'),

  model() {
    return this.get('ajax').request('/api/v1/reports/by-user', {
      data: this.modelFor('statistics')
    })
  }
})
