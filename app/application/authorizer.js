import BaseAuthorizer from 'ember-simple-auth/authorizers/base'

export default BaseAuthorizer.extend({
  authorize({ token }, setRequestHeader) {
    if (token) {
      setRequestHeader('Authorization', `Bearer ${token}`)
    }
  }
})
