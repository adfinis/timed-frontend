import Controller from '@ember/controller'
import QueryParams from 'ember-parachute'
import { task, timeout, hash } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import moment from 'moment'
import computed, { oneWay } from 'ember-computed-decorators'

const UsersQueryParams = new QueryParams({
  search: {
    defaultValue: '',
    replace: true,
    refresh: true
  },
  supervisor: {
    defaultValue: null,
    replace: true,
    refresh: true
  },
  active: {
    defaultValue: '1',
    replace: true,
    refresh: true
  },
  ordering: {
    defaultValue: 'username',
    replace: true,
    refresh: true
  }
})

const UsersIndexController = Controller.extend(UsersQueryParams.Mixin, {
  session: service('session'),

  @oneWay('session.data.user') currentUser: null,

  @computed('supervisor', 'prefetchData.lastSuccessful.value.supervisor')
  selectedSupervisor(supervisorId) {
    return this.store.peekRecord('user', supervisorId)
  },

  setup() {
    this.get('prefetchData').perform()
    this.get('data').perform()
  },

  reset() {
    this.resetQueryParams()
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get('data').perform()
    }
  },

  prefetchData: task(function*() {
    let supervisorId = this.get('supervisor')

    return yield hash({
      supervisor: supervisorId && this.store.findRecord('user', supervisorId)
    })
  }).restartable(),

  data: task(function*() {
    let date = moment().format('YYYY-MM-DD')

    yield this.store.query('employment', { date })
    yield this.store.query('worktime-balance', { date })

    return yield this.store.query('user', {
      ...this.get('allQueryParams'),
      ...(this.get('currentUser.isSuperuser')
        ? {}
        : {
            supervisor: this.get('currentUser.id')
          })
    })
  }).restartable(),

  setSearchFilter: task(function*(value) {
    yield timeout(500)

    this.set('search', value)
  }).restartable(),

  setModelFilter: task(function*(key, value) {
    yield this.set(key, value && value.id)
  }),

  resetFilter: task(function*() {
    yield this.resetQueryParams()
  })
})

export default UsersIndexController
