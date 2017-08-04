import Controller from 'ember-controller'
import service from 'ember-service/inject'

export default Controller.extend({
  notify: service(),

  queryParams: ['page'],

  page: 1,

  actions: {
    async saveReport(report) {
      try {
        await report.save()
        this.get('notify').success('Report was saved')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the report')
      }
    }
  }
})
