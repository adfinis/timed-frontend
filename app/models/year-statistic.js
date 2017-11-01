import Model from 'ember-data/model'
import attr from 'ember-data/attr'

export default Model.extend({
  year: attr('number'),
  duration: attr('django-duration')
})
