import Route                   from 'ember-route'
import service                 from 'ember-service/inject'
import { later }               from 'ember-runloop'
import { oneWay }              from 'ember-computed-decorators'
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'

export default Route.extend(AuthenticatedRouteMixin, {
  tracking: service('tracking'),

  beforeModel() {
    this._super(...arguments)

    return Promise.all([
      this.store.findAll('customer'),
      this.get('tracking').load()
    ])
  }
})
