import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'
import { inject as service } from '@ember/service'
import computed from 'ember-computed-decorators'

const SELECTED_TEMPLATE = hbs`{{selected.longName}}`

const OPTION_TEMPLATE = hbs`
  <div class="{{unless option.isActive 'inactive'}}" title="{{option.longName}}{{unless option.isActive ' (inactive)'}}">
    {{option.longName}}
    {{#unless option.isActive}}
      <i class="fa fa-ban"></i>
    {{/unless}}
  </div>
`

export default Component.extend({
  tracking: service('tracking'),
  store: service('store'),

  tagName: '',

  selectedTemplate: SELECTED_TEMPLATE,

  optionTemplate: OPTION_TEMPLATE,

  async init() {
    this._super(...arguments)

    try {
      await this.get('tracking.users').perform()
    } catch (e) {
      /* istanbul ignore next */
      if (e.taskInstance && e.taskInstance.isCanceling) {
        return
      }

      /* istanbul ignore next */
      throw e
    }
  },

  @computed('queryOptions')
  async users(queryOptions) {
    await this.get('tracking.users.last')
    queryOptions = queryOptions || {}

    if (queryOptions.active === 0) {
      return this.get('store')
        .peekAll('user')
        .sortBy('username')
    }

    queryOptions['ordering'] = 'username'
    return this.get('store').query('user', queryOptions)
  }
})
