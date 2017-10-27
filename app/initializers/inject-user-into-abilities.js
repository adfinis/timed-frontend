import { Ability } from 'ember-can'
import { oneWay } from 'ember-computed-decorators'

/**
 * Initializer to inject the session into all abilities and
 * add a shortcut to the current user
 *
 * @function initialize
 * @param {*} application The ember application
 */
export function initialize(application) {
  application.inject('ability', 'session', 'service:session')

  Ability.reopen({
    @oneWay('session.data.user') user: null
  })
}

export default {
  initialize
}
