import Component from 'ember-component'
import hbs from 'htmlbars-inline-precompile'
import service from 'ember-service/inject'
import computed from 'ember-computed-decorators'
import { typeOf } from 'ember-utils'
import { task } from 'ember-concurrency'

const FORMAT = obj => (typeOf(obj) === 'instance' ? obj.get('longName') : '')
const SUGGESTION_TEMPLATE = hbs`{{model.longName}}`
const regexFilter = (data, term, key) => {
  let re = new RegExp(`.*${term}.*`, 'i')
  return sortUserList(data.filter(i => re.test(i.get(key))))
}
const sortUserList = list => {
  return list.sort(function(modelA, modelB) {
    let valueA = modelA.get('fullName').toUpperCase()
    let valueB = modelB.get('fullName').toUpperCase()
    if (valueA < valueB) {
      return -1
    } else if (valueA > valueB) {
      return 1
    }
    return 0
  })
}

export default Component.extend({
  store: service(),

  tagName: '',

  limit: Number.MAX_SAFE_INTEGER,

  display: FORMAT,

  transformSelection: FORMAT,

  suggestionTemplate: SUGGESTION_TEMPLATE,

  placeholder: 'Select user...',

  @computed
  source() {
    return (search, syncResults, asyncResults) => {
      let fn = this.get('userTask')

      let customers = fn.get('last') || fn.perform()

      /* istanbul ignore next */
      customers
        .then(data => asyncResults(regexFilter(data, search, 'longName')))
        .catch(() => asyncResults([]))
    }
  },

  userTask: task(function*() {
    return yield this.get('store').query('user', {})
  }).restartable(),

  actions: {
    change(value) {
      this.get('attrs.on-change')(value)
    }
  }
})
