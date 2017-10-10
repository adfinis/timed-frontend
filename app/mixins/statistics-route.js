import Mixin from '@ember/object/mixin'
import computed, { max } from 'ember-computed-decorators'
import parseDjangoDuration from 'timed/utils/parse-django-duration'
import moment from 'moment'

export default Mixin.create({
  @computed('model.data.[]')
  durations(data) {
    return data.map(obj => parseDjangoDuration(obj.attributes.duration))
  },

  @max('durations') maxDuration: moment.duration()
})
