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

/**
 * Service to fetch metadata and transform it if necessary
 *
 * @class MetadataFetcherService
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  /**
   * Ajax service to handle HTTP requests
   *
   * @property {EmberAjax.AjaxService} ajax
   * @public
   */
  ajax: service('ajax'),

  /**
   * Task to fetch a single records metadata
   *
   * @method fetchSingleRecordMetadata
   * @param {String} type The type to fetch
   * @param {Number} id The id of the object to fetch
   * @return {Object} An object with the parsed metadata
   * @public
   */
  fetchSingleRecordMetadata: task(function*(type, id) {
    /* istanbul ignore next */
    if (!id) {
      throw new Error('Project ID is missing')
    }

    let { meta = {} } = yield this.get('ajax').request(
      `/api/v1/${dasherize(type)}s/${id}`
    )

    return Object.keys(
      META_MODELS[camelize(type)]
    ).reduce((parsedMeta, key) => {
      let { defaultValue, transform } = META_MODELS[camelize(type)][key]
      let value = meta[dasherize(key)]

      return {
        ...parsedMeta,
        [key]: value ? transform.deserialize(value) : defaultValue
      }
    }, {})
  }).restartable()
})
