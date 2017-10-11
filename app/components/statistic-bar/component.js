import Component from '@ember/component'
import { scheduleOnce, later } from '@ember/runloop'

const StatisticsBarComponent = Component.extend({
  tagName: 'statistics-bar',

  didReceiveAttrs() {
    this._super(...arguments)

    scheduleOnce('afterRender', this, () => {
      let [element] = this.get('element').getElementsByTagName('bar')
      let width = `${this.get('value') * 100}%`

      element.animate([{ width: 0 }, { width }], {
        duration: 1000,
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
      })

      element.style.width = width
    })
  }
})

StatisticsBarComponent.reopenClass({
  positionalParams: ['value']
})

export default StatisticsBarComponent
