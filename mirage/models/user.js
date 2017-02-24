import { Model, hasMany } from 'ember-cli-mirage'

export default Model.extend({
  activities: hasMany(),
  reports: hasMany(),
  employments: hasMany()
})
