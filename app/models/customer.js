import Model       from 'ember-data/model'
import attr        from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'

export default Model.extend({
  name:     attr('string', { defaultValue: '' }),
  email:    attr('string', { defaultValue: '' }),
  website:  attr('string', { defaultValue: '' }),
  comment:  attr('string', { defaultValue: '' }),
  projects: hasMany('project')
})
