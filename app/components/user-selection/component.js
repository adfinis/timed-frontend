import Component from 'ember-component'
import hbs from 'htmlbars-inline-precompile'
import service from 'ember-service/inject'
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

  inactive: false,

  init() {
    this._super(...arguments)

    if (!this.get('tracking.users.last')) {
      this.get('tracking.users').perform()
    }
  },

  @computed('inactive')
  async users(inactive) {
    try {
      await this.get('tracking.users.last')

      return this.get('store')
        .peekAll('user')
        .filter(u => {
          return inactive ? true : u.get('isActive')
        })
        .sortBy('username')
    } catch (e) {
      return []
    }
  }
})
