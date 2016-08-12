import Model       from 'ember-data/model'
import attr        from 'ember-data/attr'
import computed    from 'ember-computed-decorators'
import { hasMany } from 'ember-data/relationships'

export default Model.extend({
  username:    attr('string', { defaultValue: '' }),
  firstName:   attr('string', { defaultValue: '' }),
  lastName:    attr('string', { defaultValue: '' }),
  password:    attr('string', { defaultValue: '' }),
  projects:    hasMany('project'),
  attendances: hasMany('attendance'),

  @computed('firstName', 'lastName')
  fullName(firstName, lastName) {
    return `${firstName} ${lastName}`
  },

  @computed('username', 'fullName')
  longName(username, fullName) {
    return fullName ? `${fullName} (${username})` : username
  }
})
