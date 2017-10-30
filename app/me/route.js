import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  session: service('session'),

  redirect() {
    this.replaceWith('users.edit', this.get('session.data.user.id'))
  }
})
