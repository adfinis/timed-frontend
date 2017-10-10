import Component from '@ember/component'
import computed from 'ember-computed-decorators'
import { htmlSafe } from '@ember/string'

const StatisticsBarComponent = Component.extend({
  tagName: 'statistics-bar',

  @computed('value')
  barStyle(value) {
    return htmlSafe(`width: ${value * 100}%;`)
  }
})

StatisticsBarComponent.reopenClass({
  positionalParams: ['value']
})

export default StatisticsBarComponent
