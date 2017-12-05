import Controller from '@ember/controller'
import { get, computed as computedFn } from '@ember/object'
import { underscore } from '@ember/string'
import QueryParams from 'ember-parachute'
import { task, hash } from 'ember-concurrency'
import computed from 'ember-computed-decorators'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

const serializeMoment = momentObject =>
  (momentObject && momentObject.format(DATE_FORMAT)) || null

const deserializeMoment = momentString =>
  (momentString && moment(momentString, DATE_FORMAT)) || null

const TYPES = {
  year: { include: '', requiredParams: [] },
  month: { include: '', requiredParams: [] },
  customer: { include: 'customer', requiredParams: [] },
  project: {
    include: 'project,project.customer',
    requiredParams: ['customer']
  },
  task: {
    include: 'task,task.project,task.project.customer',
    requiredParams: ['customer', 'project']
  },
  user: { include: 'user', requiredParams: [] }
}

export const StatisticsQueryParams = new QueryParams({
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
  type: {
    defaultValue: Object.keys(TYPES)[0],
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: '',
    replace: true,
    refresh: true
  }
})

export default Controller.extend(StatisticsQueryParams.Mixin, {
  types: Object.keys(TYPES),

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

  setup() {
    let observed = Object.keys(TYPES).reduce((set, key) => {
      return [
        ...set,
        ...get(TYPES, `${key}.requiredParams`).filter(p => !set.includes(p))
      ]
    }, [])

    this.set(
      'missingParams',
      computedFn(
        'requiredParams.[]',
        `queryParamsState.{${observed.join(',')}}.changed`,
        () => {
          return this.get('requiredParams').filter(
            param => !this.get(`queryParamsState.${param}.changed`)
          )
        }
      )
    )

    this.get('prefetchData').perform()
    this.get('data').perform()
  },

  reset(_, isExiting) {
    if (isExiting) {
      this.resetQueryParams()
    }
  },

  queryParamsDidChange({ shouldRefresh, changed }) {
    if (shouldRefresh) {
      this.get('data').perform()
    }

    if (Object.keys(changed).includes('type')) {
      this.resetQueryParams('ordering')
    }
  },

  @computed('queryParamsState')
  appliedFilters(state) {
    return Object.keys(state).filter(key => {
      return this.get(`queryParamsState.${key}.changed`)
    })
  },

  @computed('type')
  requiredParams(type) {
    return TYPES[type].requiredParams
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
  }).restartable(),

  data: task(function*() {
    if (this.get('missingParams.length')) {
      return null
    }

    let type = this.get('type')
    let all = this.get('allQueryParams')
    let params = Object.keys(all).reduce((parsed, key) => {
      let serialize = get(StatisticsQueryParams, `queryParams.${key}.serialize`)
      let value = get(all, key)

      return key === 'type'
        ? parsed
        : { ...parsed, [underscore(key)]: serialize ? serialize(value) : value }
    }, {})

    return yield this.store.query(`${type}-statistic`, {
      include: TYPES[type].include,
      ...params
    })
  }).restartable(),

  actions: {
    setModelFilter(key, value) {
      this.set(key, value && value.id)
    },

    reset() {
      this.resetQueryParams(
        Object.keys(this.get('allQueryParams')).filter(qp => qp !== 'type')
      )
    }
  }
})
