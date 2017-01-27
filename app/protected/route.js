import Route                   from 'ember-route'
import RSVP                    from 'rsvp'
import service                 from 'ember-service/inject'
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'

export default Route.extend(AuthenticatedRouteMixin, {
  tracking: service('tracking'),

  beforeModel() {
    this._super(...arguments)

    return RSVP.Promise.all([
      this.store.findAll('customer'),
      this.get('tracking').load()
    ])
  }
})
