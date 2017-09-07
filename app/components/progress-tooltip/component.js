import Component from 'ember-component'
import computed, { oneWay } from 'ember-computed-decorators'
import moment from 'moment'
import { task, timeout } from 'ember-concurrency'
import service from 'ember-service/inject'

export default Component.extend({
  tagName: '',

  delay: 300,

  metadataFetcher: service('metadata-fetcher'),

  @oneWay('model.estimatedTime') estimated: moment.duration(),
  spent: moment.duration(),

  @computed('estimated', 'spent')
  progress(estimated, spent) {
    return estimated && estimated.asHours() ? spent / estimated : 0
  },

  @computed('progress')
  color(progress) {
    if (progress > 1) {
      return 'danger'
    } else if (progress >= 0.9) {
      return 'warning'
    }

    return 'success'
  },

  @computed('visible')
  tooltipVisible(visible) {
    let task = this.get('_computeTooltipVisible')

    task.perform(visible)

    return task
  },

  _computeTooltipVisible: task(function*(visible) {
    if (visible) {
      yield timeout(this.get('delay'))

      let { spentTime } = yield this.get(
        'metadataFetcher.fetchSingleRecordMetadata'
      ).perform(this.get('model.constructor.modelName'), this.get('model.id'))

      this.set('spent', spentTime)
    }

    return visible
  }).restartable()
})
