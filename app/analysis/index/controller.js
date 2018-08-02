import Controller from '@ember/controller'
import { A } from '@ember/array'
import { task, hash } from 'ember-concurrency'
import computed, { oneWay } from 'ember-computed-decorators'
import QueryParams from 'ember-parachute'
import moment from 'moment'
import config from '../../config/environment'
import { inject as service } from '@ember/service'
import RSVP from 'rsvp'
import { cleanParams, toQueryString } from 'timed/utils/url'
import fetch from 'fetch'
import download from 'downloadjs'
import Ember from 'ember'
import {
  underscoreQueryParams,
  serializeParachuteQueryParams
} from 'timed/utils/query-params'
import parseDjangoDuration from 'timed/utils/parse-django-duration'

const { testing } = Ember

const rAF = () => {
  return new RSVP.Promise(resolve => {
    window.requestAnimationFrame(resolve)
  })
}

const DATE_FORMAT = 'YYYY-MM-DD'

const serializeMoment = momentObject =>
  (momentObject && momentObject.format(DATE_FORMAT)) || null

const deserializeMoment = momentString =>
  (momentString && moment(momentString, DATE_FORMAT)) || null

export const AnalysisQueryParams = new QueryParams({
  customer: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  project: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  task: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  user: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  reviewer: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  billingType: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  costCenter: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  fromDate: {
    defaultValue: null,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment
  },
  toDate: {
    defaultValue: null,
    replace: true,
    refresh: true,
    serialize: serializeMoment,
    deserialize: deserializeMoment
  },
  review: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  notBillable: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  verified: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  editable: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: '-date',
    replace: true,
    refresh: true,
    serialize(val) {
      return `${val},id`
    },
    deserialize(val) {
      return val.replace(',id', '')
    }
  }
})

const AnalysisController = Controller.extend(AnalysisQueryParams.Mixin, {
  @computed('prefetchData.lastSuccessful.value.billingTypes')
  billingTypes() {
    return this.store.findAll('billing-type')
  },

  @computed('prefetchData.lastSuccessful.value.costCenters')
  costCenters() {
    return this.store.findAll('cost-center')
  },

  @computed('customer', 'prefetchData.lastSuccessful.value.customer')
  selectedCustomer(id) {
    return id && this.store.peekRecord('customer', id)
  },

  @computed('project', 'prefetchData.lastSuccessful.value.project')
  selectedProject(id) {
    return id && this.store.peekRecord('project', id)
  },

  @computed('task', 'prefetchData.lastSuccessful.value.task')
  selectedTask(id) {
    return id && this.store.peekRecord('task', id)
  },

  @computed('user', 'prefetchData.lastSuccessful.value.user')
  selectedUser(id) {
    return id && this.store.peekRecord('user', id)
  },

  @computed('reviewer', 'prefetchData.lastSuccessful.value.reviewer')
  selectedReviewer(id) {
    return id && this.store.peekRecord('user', id)
  },

  exportLinks: config.APP.REPORTEXPORTS,

  session: service('session'),

  notify: service('notify'),

  can: service('can'),

  @oneWay('session.data.authenticated.token') jwt: null,

  init() {
    this._super(...arguments)

    this.set('_dataCache', A())
    this.set('selectedReportIds', A())
  },

  setup() {
    this.get('prefetchData').perform()

    if (!this.get('skipResetOnSetup')) {
      this._reset()
    }
  },

  _reset() {
    this.get('data').cancelAll()
    this.get('loadNext').cancelAll()

    this.setProperties({
      _lastPage: 0,
      _canLoadMore: true,
      _shouldLoadMore: false,
      _dataCache: A(),
      selectedReportIds: A()
    })

    this.get('data').perform()
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this._reset()
    }
  },

  _shouldLoadMore: false,
  _canLoadMore: true,
  _lastPage: 0,

  @computed('queryParamsState')
  appliedFilters(state) {
    return Object.keys(state).filter(key => {
      return key !== 'ordering' && this.get(`queryParamsState.${key}.changed`)
    })
  },

  prefetchData: task(function*() {
    let {
      customer: customerId,
      project: projectId,
      task: taskId,
      user: userId,
      reviewer: reviewerId
    } = this.get('allQueryParams')

    return yield hash({
      customer: customerId && this.store.findRecord('customer', customerId),
      project: projectId && this.store.findRecord('project', projectId),
      task: taskId && this.store.findRecord('task', taskId),
      user: userId && this.store.findRecord('user', userId),
      reviewer: reviewerId && this.store.findRecord('user', reviewerId),
      billingTypes: this.store.findAll('billing-type'),
      costCenters: this.store.findAll('cost-center')
    })
  }),

  data: task(function*() {
    let params = underscoreQueryParams(
      serializeParachuteQueryParams(
        this.get('allQueryParams'),
        AnalysisQueryParams
      )
    )

    let data = yield this.store.query('report', {
      page: this.get('_lastPage') + 1,
      page_size: 20, // eslint-disable-line camelcase
      ...params,
      include:
        'task,task.project,task.project.customer,task.project.reviewers,user'
    })

    this.setProperties({
      totalTime: parseDjangoDuration(data.get('meta.total-time')),
      totalItems: parseInt(data.get('meta.pagination.count')),
      _canLoadMore:
        data.get('meta.pagination.pages') !== data.get('meta.pagination.page'),
      _lastPage: data.get('meta.pagination.page')
    })

    this.get('_dataCache').pushObjects(data.toArray())

    return this.get('_dataCache')
  }).enqueue(),

  loadNext: task(function*() {
    this.set('_shouldLoadMore', true)

    while (this.get('_shouldLoadMore') && this.get('_canLoadMore')) {
      yield this.get('data').perform()

      yield rAF()
    }
  }).drop(),

  download: task({
    url: null,
    params: {},

    *perform(notify, allQueryParams, jwt, { url, params }) {
      try {
        this.setProperties({ url, params })

        let queryString = toQueryString(
          underscoreQueryParams(
            cleanParams({
              ...params,
              ...serializeParachuteQueryParams(
                allQueryParams,
                AnalysisQueryParams
              )
            })
          )
        )

        let res = yield fetch(`${url}?${queryString}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })

        /* istanbul ignore next */
        if (!res.ok) {
          throw new Error(res.statusText)
        }

        let file = yield res.blob()

        // filename      match filename, followed by
        // [^;=\n]*      anything but a ;, a = or a newline
        // =
        // (             first capturing group
        //     (['"])    either single or double quote, put it in capturing group 2
        //     .*?       anything up until the first...
        //     \2        matching quote (single if we found single, double if we find double)
        // |
        //     [^;\n]*   anything but a ; or a newline
        // )
        let filename =
          res.headers.map['content-disposition']
            .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g)[0]
            .replace('filename=', '') || 'Unknown file'

        // ignore since we can't really test this..
        /* istanbul ignore next */
        if (!testing) {
          download(file, filename, file.type)
        }

        notify.success('File was downloaded')
      } catch (e) {
        /* istanbul ignore next */
        notify.error(
          'Error while downloading, try again or try reducing results'
        )
      }
    }
  }),

  actions: {
    edit(ids = []) {
      this.transitionToRoute('analysis.edit', {
        queryParams: {
          id: ids,
          ...this.get('allQueryParams')
        }
      })
    },

    selectRow(report) {
      if (this.get('can').can('edit report', report)) {
        let selected = this.get('selectedReportIds')

        if (selected.includes(report.id)) {
          this.set(
            'selectedReportIds',
            A([...selected.filter(id => id !== report.id)])
          )
        } else {
          this.set('selectedReportIds', A([...selected, report.id]))
        }
      }
    },

    setModelFilter(key, value) {
      this.set(key, value && value.id)
    },

    reset() {
      this.resetQueryParams(
        Object.keys(this.get('allQueryParams')).filter(k => k !== 'ordering')
      )
    }
  }
})

export default AnalysisController
