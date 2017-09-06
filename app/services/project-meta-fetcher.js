import Service from 'ember-service'
import service from 'ember-service/inject'
import DjangoDurationTransform from 'timed/transforms/django-duration'
import { dasherize } from 'ember-string'
import { task } from 'ember-concurrency'

const DJANGO_DURATION_TRANSFORM = new DjangoDurationTransform()

const META_MODEL = {
  spentTime: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM }
}

export default Service.extend({
  DJANGO_DURATION_TRANSFORM,

  ajax: service('ajax'),

  fetchProjectMetadata: task(function*(id) {
    if (!id) {
      throw new Error('Project ID is missing')
    }

    let { meta } = yield this.get('ajax').request(`/api/v1/projects/${id}`)

    return Object.keys(META_MODEL).reduce((parsedMeta, key) => {
      let { defaultValue, transform, value } = {
        ...META_MODEL[key],
        value: meta[dasherize(key)]
      }

      return {
        ...parsedMeta,
        [key]: value ? transform.deserialize(value) : defaultValue
      }
    }, {})
  }).restartable()
})
