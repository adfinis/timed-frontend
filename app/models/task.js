import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

export default Model.extend({
  name:          attr('string', { defaultValue: '' }),
  estimatedTime: attr('number'),
  archived:      attr('boolean', { defaultValue: false }),
  project:       belongsTo('project')
})
