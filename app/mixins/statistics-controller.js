import Mixin from '@ember/object/mixin'
import { task } from 'ember-concurrency'
import { StatisticsQueryParams } from 'timed/statistics/controller'
import computed from 'ember-computed-decorators'
import moment from 'moment'

export default Mixin.create(StatisticsQueryParams.Mixin, {
  queryParamsDidChange() {
    this.get('data').perform()
  },

  setup() {
    this.get('data').perform()
  },

  data: task(function*() {
    return yield this.store.query(
      this.get('modelName'),
      this.get('allQueryParams')
    )
  }),

  @computed('data.lastSuccessful.value')
  maxDuration(data) {
    return data && moment.duration(Math.max(...data.mapBy('duration')))
  }
})
