import Component from '@ember/component'
import { htmlSafe } from '@ember/string'
import computed from 'ember-computed-decorators'

const StatisticListBarComponent = Component.extend({
  attributeBindings: ['style'],

  @computed('value')
  style(value) {
    return htmlSafe(`--value: ${value}`)
  }
})

StatisticListBarComponent.reopenClass({
  positionalParams: ['value']
})

export default StatisticListBarComponent
