import Route                   from 'ember-route'
import RSVP                    from 'rsvp'
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'

export default Route.extend(AuthenticatedRouteMixin, {
  beforeModel() {
    this._super(...arguments)

    return RSVP.Promise.all([
      this.store.findAll('customer', { include: 'projects,projects.tasks' }),
      this.store.query('activity', { include: 'blocks', active: true })
    ])
  }
})
