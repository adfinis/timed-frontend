import Component from '@ember/component'
import { htmlSafe } from '@ember/string'
import computed from 'ember-computed-decorators'

const StatisticBarComponent = Component.extend({
  attributeBindings: ['style'],

  @computed('value')
  style(value) {
    return htmlSafe(`--value: ${value}`)
  }
})

StatisticBarComponent.reopenClass({
  positionalParams: ['value']
})

export default StatisticBarComponent
