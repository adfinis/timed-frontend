import Controller, { inject as controller } from '@ember/controller'
import { inject as service } from '@ember/service'
import { task } from 'ember-concurrency'
import { AnalysisQueryParams } from '../index/controller'
import { dasherize } from '@ember/string'
import { cleanParams } from 'timed/utils/url'
import { computed } from '@ember/object'
import { toQueryString } from 'timed/utils/url'
import IntersectionValidations from 'timed/validations/intersection'
import { later } from '@ember/runloop'
import {
  underscoreQueryParams,
  serializeParachuteQueryParams,
  filterQueryParams
} from 'timed/utils/query-params'

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
export const AnalysisEditQueryParams = AnalysisQueryParams.extend({
  id: {
    defaultValue: [],
    replace: true,
    refresh: true,
    serialize(arr) {
      return (arr && arr.join(',')) || ''
    },
    deserialize(str) {
      return (str && str.split(',')) || []
    }
  }
})
/* eslint-enable ember/avoid-leaking-state-in-ember-objects */

const prepareParams = params =>
  cleanParams(
    underscoreQueryParams(
      serializeParachuteQueryParams(
        filterQueryParams(params, 'editable'),
        AnalysisEditQueryParams
      )
    )
  )

const filterUnchanged = (attributes, changes) => {
  return Object.keys(attributes).reduce((obj, attr) => {
    return changes.map(({ key }) => dasherize(key)).includes(attr)
      ? { ...obj, [attr]: attributes[attr] }
      : obj
  }, {})
}

export default Controller.extend(AnalysisEditQueryParams.Mixin, {
  IntersectionValidations,

  notify: service('notify'),
  ajax: service('ajax'),
  session: service('session'),

  analysisIndexController: controller('analysis.index'),

  setup() {
    this.get('intersection').perform()
  },

  intersection: task(function*() {
    let res = yield this.get('ajax').request('/api/v1/reports/intersection', {
      method: 'GET',
      data: {
        ...prepareParams(this.get('allQueryParams')),
        editable: 1,
        include: 'task,project,customer'
      }
    })

    yield this.store.pushPayload('report-intersection', res)

    return {
      model: this.store.peekRecord('report-intersection', res.data.id),
      meta: res.meta
    }
  }),

  _customer: computed(
    'intersection.lastSuccessful.value.model.customer.id',
    function() {
      let id = this.get('intersection.lastSuccessful.value.model.customer.id')
      return id && this.store.peekRecord('customer', id)
    }
  ),

  _project: computed(
    'intersection.lastSuccessful.value.model.project.id',
    function() {
      let id = this.get('intersection.lastSuccessful.value.model.project.id')
      return id && this.store.peekRecord('project', id)
    }
  ),

  _task: computed(
    'intersection.lastSuccessful.value.model.task.id',
    function() {
      let id = this.get('intersection.lastSuccessful.value.model.task.id')
      return id && this.store.peekRecord('task', id)
    }
  ),

  canVerify: computed(
    'allQueryParams.reviewer',
    'session.data.user',
    function() {
      return (
        this.get('allQueryParams.reviewer') ===
          this.get('session.data.user.id') ||
        this.get('session.data.user.isSuperuser')
      )
    }
  ),

  save: task(function*(changeset) {
    try {
      let params = prepareParams(this.get('allQueryParams'))

      let queryString = toQueryString(params)

      yield changeset.execute()

      let { data: { attributes, relationships } } = this.get(
        'intersection.lastSuccessful.value.model'
      ).serialize()

      params.id
        .split(',')
        .without('')
        .forEach(async id => {
          let report = await this.store.peekRecord('report', id)
          if (report) {
            changeset.get('changes').forEach(obj => {
              if (obj.key === 'verified') {
                obj.key = 'verifiedBy'
                obj.value = obj.value ? this.get('session.data.user') : null
              }
              report.set(obj.key, obj.value)
            })
            await report.save()
          }
        })

      let data = {
        type: 'report-bulks',
        attributes: filterUnchanged(attributes, changeset.get('changes')),
        relationships: filterUnchanged(relationships, changeset.get('changes'))
      }

      yield this.get(
        'ajax'
      ).request(`/api/v1/reports/bulk?editable=1&${queryString}`, {
        method: 'POST',
        data: { data }
      })

      this.set('analysisIndexController.skipResetOnSetup', true)
      this.set('analysisIndexController.saved', true)
      this.transitionToRoute('analysis.index', {
        queryParams: {
          ...this.get('allQueryParams')
        }
      })

      this.get('notify').success('Reports were saved')
    } catch (e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while saving the reports')
    }
  }),

  actions: {
    validate(changeset) {
      changeset.validate()
    },

    cancel() {
      let task = this.get('analysisIndexController.data')

      /* istanbul ignore next */
      if (task.get('lastSuccessful')) {
        this.set('analysisIndexController.skipResetOnSetup', true)
      }

      this.set('analysisIndexController.saved', false)
      this.transitionToRoute('analysis.index', {
        queryParams: {
          ...this.get('allQueryParams')
        }
      }).then(() => {
        this.set('analysisIndexController.skipResetOnSetup', false)
      })
    },

    reset(changeset) {
      // We have to defer the rollback for some milliseconds since the combobox
      // reset action triggers mutation of customer, task, and project which
      // would be run after this rollback and therefore trigger changes
      later(() => {
        changeset.rollback()
      })
    }
  }
})
