import Controller from '@ember/controller'
import QueryParams from 'ember-parachute'
import { task } from 'ember-concurrency'
import computed from 'ember-computed-decorators'
import moment from 'moment'
import { get } from '@ember/object'
import { hash } from 'ember-concurrency'

const querify = key => key.replace(/\./g, '__')

const buildRow = (title, type, disableOrdering = false) => {
  return (key, orderKey) => ({
    key,
    title,
    type,
    ordering: !disableOrdering && querify(orderKey || key)
  })
}

const ROWS = {
  year: buildRow('Year', 'plain'),
  month: buildRow('Month', 'month'),
  customer: buildRow('Customer', 'plain'),
  project: buildRow('Project', 'plain'),
  task: buildRow('Task', 'plain'),
  user: buildRow('User', 'plain'),
  estimated: buildRow('Estimated', 'duration'),
  duration: buildRow('Duration', 'duration'),
  bar: buildRow('', 'bar', true)
}

const TYPES = {
  YEAR: {
    ROWS: [ROWS.year('year'), ROWS.duration('duration'), ROWS.bar('duration')]
  },
  MONTH: {
    ROWS: [
      ROWS.year('year'),
      ROWS.month('month'),
      ROWS.duration('duration'),
      ROWS.bar('duration')
    ]
  },
  CUSTOMER: {
    ROWS: [
      ROWS.customer('customer.name'),
      ROWS.duration('duration'),
      ROWS.bar('duration')
    ],
    INCLUDE: 'customer'
  },
  PROJECT: {
    ROWS: [
      ROWS.customer('project.customer.name'),
      ROWS.project('project.name'),
      ROWS.estimated('estimated'),
      ROWS.duration('duration'),
      ROWS.bar('duration')
    ],
    INCLUDE: 'project,project.customer'
  },
  TASK: {
    ROWS: [
      ROWS.customer('task.project.customer.name'),
      ROWS.project('task.project.name'),
      ROWS.task('task.name'),
      ROWS.estimated('estimated'),
      ROWS.duration('duration'),
      ROWS.bar('duration')
    ],
    INCLUDE: 'task,task.project,task.project.customer'
  },
  USER: {
    ROWS: [
      ROWS.user('user.fullName', 'user.username'),
      ROWS.duration('duration'),
      ROWS.bar('duration')
    ],
    INCLUDE: 'user'
  }
}

const DateParam = {
  serialize(momentValue) {
    return (
      (momentValue &&
        momentValue.isValid() &&
        momentValue.format('YYYY-MM-DD')) ||
      null
    )
  },

  deserialize(str) {
    let deserialized = moment(str, 'YYYY-MM-DD')

    return deserialized.isValid() ? deserialized : null
  }
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
    as: 'billing_type',
    defaultValue: null,
    replace: true,
    refresh: true
  },
  fromDate: {
    as: 'from',
    defaultValue: null,
    replace: true,
    refresh: true,
    ...DateParam
  },
  toDate: {
    as: 'to',
    defaultValue: null,
    replace: true,
    refresh: true,
    ...DateParam
  },
  review: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  notBillable: {
    as: 'not_billable',
    defaultValue: null,
    replace: true,
    refresh: true
  },
  notVerified: {
    as: 'not_verified',
    defaultValue: null,
    replace: true,
    refresh: true
  },
  type: {
    defaultValue: Object.keys(TYPES)[0].toLowerCase(),
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
  types: Object.keys(TYPES).map(t => t.toLowerCase()),

  @computed('type')
  rows(type) {
    return get(TYPES[type.toUpperCase()], 'ROWS')
  },

  @computed('type')
  modelName(type) {
    return `report-${type}`
  },

  @computed('data.lastSuccessful.value')
  maxDuration(data) {
    return data && moment.duration(Math.max(...data.mapBy('duration')))
  },

  setup() {
    this.get('data').perform()
    this.get('prefetchData').perform()
  },

  queryParamsDidChange({ shouldRefresh, changed }) {
    if (shouldRefresh) {
      this.get('data').perform()
    }

    let ordering = this.get('ordering').replace(/^-/, '')

    if (
      Object.keys(changed).includes('type') &&
      Object.keys(TYPES).filter(k => {
        return TYPES[k].ROWS.find(r => r.ordering === ordering)
      }).length !== Object.keys(TYPES).length
    ) {
      this.resetQueryParams('ordering')
    }
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
      billingTypes: this.store.findAll('billing-type')
    })
  }).restartable(),

  data: task(function*() {
    let include = get(TYPES[this.get('type').toUpperCase()], 'INCLUDE') || ''

    let qp = this.get('allQueryParams')

    return yield this.store.query(this.get('modelName'), {
      include,
      ...Object.keys(qp).reduce((params, key) => {
        return key === 'type' ? params : { ...params, [key]: get(qp, key) }
      }, {})
    })
  }).restartable(),

  actions: {
    applyFilter(filters) {
      this.setProperties(filters)
    }
  }
})
