import { Model, hasMany } from 'ember-cli-mirage'

export default Model.extend({
  employments: hasMany(),
  userAbsenceTypes: hasMany(),
  supervisors: hasMany('user', { inverse: 'supervisees' }),
  supervisees: hasMany('user', { inverse: 'supervisors' })
})
