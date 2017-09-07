import Service from 'ember-service'
import service from 'ember-service/inject'
import DjangoDurationTransform from 'timed/transforms/django-duration'
import { camelize, dasherize } from 'ember-string'
import { task } from 'ember-concurrency'

const DJANGO_DURATION_TRANSFORM = new DjangoDurationTransform()

const META_MODELS = {
  project: {
    spentTime: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM }
  },
  task: {
    spentTime: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM }
  }
}
export default Service.extend({
  ajax: service('ajax'),

  fetchSingleRecordMetadata: task(function*(type, id) {
    if (!id) {
      throw new Error('Project ID is missing')
    }

    let { meta } = yield this.get('ajax').request(
      `/api/v1/${dasherize(type)}s/${id}`
    )

    return Object.keys(
      META_MODELS[camelize(type)]
    ).reduce((parsedMeta, key) => {
      let { defaultValue, transform, value } = {
        ...META_MODELS[camelize(type)][key],
        value: meta[dasherize(key)]
      }

      return {
        ...parsedMeta,
        [key]: value ? transform.deserialize(value) : defaultValue
      }
    }, {})
  }).restartable()
})
