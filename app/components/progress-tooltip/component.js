import Component from 'ember-component'
import computed, { oneWay, observes } from 'ember-computed-decorators'
import moment from 'moment'
import { task, timeout } from 'ember-concurrency'
import service from 'ember-service/inject'

export default Component.extend({
  tagName: '',

  requestDelay: 200,
  tooltipDelay: 750,

  projectMetaFetcher: service('project-meta-fetcher'),

  visible: false,
  tooltipVisible: false,

  @computed('progress')
  badgeColor(progress) {
    if (progress > 1) {
      return 'danger'
    } else if (progress >= 0.9) {
      return 'warning'
    }

    return 'success'
  },

  @observes('visible')
  _perform() {
    this.get('_computeTooltipVisible').perform()
  },

  _computeTooltipVisible: task(function*() {
    let visible = this.get('visible')

    if (visible) {
      let { requestDelay, tooltipDelay } = this.getProperties(
        'requestDelay',
        'tooltipDelay'
      )

      yield timeout(requestDelay)

      let startTime = moment()

      let { spentTime } = yield this.get(
        'projectMetaFetcher.fetchProjectMetadata'
      ).perform(this.get('project.id'))

      this.set('spent', spentTime)

      let endTime = moment()

      let diff = endTime - startTime

      let delay = tooltipDelay - requestDelay - diff

      if (delay > 0) {
        yield timeout(delay)
      }
    }

    this.set('tooltipVisible', visible)
  })
    .restartable()
    .on('init'),

  side: 'left',

  event: 'none',

  @oneWay('project.estimatedTime') estimated: moment.duration(),

  spent: moment.duration(),

  @computed('estimated', 'spent')
  progress(estimated, spent) {
    return estimated && estimated.asHours() ? spent / estimated : null
  }
})
