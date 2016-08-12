import service     from 'ember-service/inject'
import computed    from 'ember-computed-decorators'
import AjaxService from 'ember-ajax/services/ajax'

export default AjaxService.extend({
  session: service('session'),

  @computed('session.data.authenticated.token')
  headers(token) {
    let headers = {
      'Accept':       'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }

    let auth = token ? {
      'Authorization': `Bearer ${token}`,
    } : {}

    return Object.assign(headers, auth)
  }
})
