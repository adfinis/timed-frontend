import Component from '@ember/component'
import { htmlSafe } from '@ember/string'
import { computed } from '@ember/object'

const StatisticListBarComponent = Component.extend({
  classNames: ['statistic-list-bar'],

  attributeBindings: ['style'],

  style: computed('value', function() {
    return htmlSafe(`--value: ${this.get('value')}`)
  })
})

StatisticListBarComponent.reopenClass({
  positionalParams: ['value']
})

export default StatisticListBarComponent
