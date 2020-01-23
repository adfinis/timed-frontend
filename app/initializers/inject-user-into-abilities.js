import { Ability } from 'ember-can'
import { reads } from '@ember/object/computed'

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
    user: reads('session.data.user')
  })
}

export default {
  initialize
}
