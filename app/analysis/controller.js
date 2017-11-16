import Controller from '@ember/controller'
import { A } from '@ember/array'
import { task, hash } from 'ember-concurrency'
import computed, { oneWay } from 'ember-computed-decorators'
import QueryParams from 'ember-parachute'
import moment from 'moment'
import config from '../config/environment'
import { inject as service } from '@ember/service'
import RSVP from 'rsvp'
import { cleanParams, toQueryString } from 'timed/utils/url'
import fetch from 'fetch'
import download from 'downloadjs'

const raf = () => {
  return new RSVP.Promise(resolve => {
    window.requestAnimationFrame(resolve)
  })
}

const DATE_FORMAT = 'YYYY-MM-DD'

const serializeMoment = momentObject =>
  (momentObject && momentObject.format(DATE_FORMAT)) || null

const deserializeMoment = momentString =>
  (momentString && moment(momentString, DATE_FORMAT)) || null

const AnalysisQueryParams = new QueryParams({
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
  notVerified: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: '-date',
    replace: true,
    refresh: true
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

  @oneWay('session.data.authenticated.token') jwt: null,

  setup() {
    this.get('prefetchData').perform()
    this.get('data').perform()
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get('data').cancelAll()
      this.get('loadNext').cancelAll()

      this.setProperties({
        _lastPage: 0,
        _canLoadMore: true,
        _shouldLoadMore: false,
        _dataCache: A()
      })

      this.get('data').perform()
    }
  },

  _shouldLoadMore: false,
  _canLoadMore: true,
  _lastPage: 0,
  _dataCache: A(),

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
    let data = yield this.store.query('report', {
      page: this.get('_lastPage') + 1,
      page_size: 20, // eslint-disable-line camelcase
      ...this.get('allQueryParams'),
      include: 'task,task.project,task.project.customer,user'
    })

    this.set(
      '_canLoadMore',
      data.get('meta.pagination.pages') !== data.get('meta.pagination.page')
    )

    this.set('_lastPage', data.get('meta.pagination.page'))

    this.get('_dataCache').pushObjects(data.toArray())

    return this.get('_dataCache')
  }).enqueue(),

  loadNext: task(function*() {
    this.set('_shouldLoadMore', true)

    while (this.get('_shouldLoadMore') && this.get('_canLoadMore')) {
      yield this.get('data').perform()

      yield raf()
    }
  }).drop(),

  /**
   * Content-Disposition regex explaination:
   *
   * filename      # match filename, followed by
   * [^;=\n]*      # anything but a ;, a = or a newline
   * =
   * (             # first capturing group
   *     (['"])    # either single or double quote, put it in capturing group 2
   *     .*?       # anything up until the first...
   *     \2        # matching quote (single if we found single, double if we find double)
   * |             # OR
   *     [^;\n]*   # anything but a ; or a newline
   * )
   */
  download: task({
    url: null,
    params: {},

    *perform(notify, allQueryParams, jwt, { url, params }) {
      try {
        this.setProperties({ url, params })

        let queryString = toQueryString(
          cleanParams({
            ...params,
            ...allQueryParams
          })
        )

        let res = yield fetch(`${url}?${queryString}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })

        if (!res.ok) {
          throw new Error(res.statusText)
        }

        let file = yield res.blob()

        let filename =
          res.headers.map['content-disposition']
            .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g)[0]
            .replace('filename=', '') || 'export.csv'

        download(file, filename, file.type)

        notify.success('File was downloaded')
      } catch (e) {
        notify.error(
          'Error while downloading, try again or try reducing results'
        )
      } finally {
        this.setProperties({ url: null, params: {} })
      }
    }
  }),

  actions: {
    setModelFilter(key, value) {
      this.set(key, value && value.id)
    },

    reset() {
      this.resetQueryParams(
        this.get('queryParams').filter(k => k !== 'ordering')
      )
    }
  }
})

export default AnalysisController
