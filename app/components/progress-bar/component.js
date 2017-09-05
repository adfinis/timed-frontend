import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import { htmlSafe } from 'ember-string'

const { round } = Math

const ProgressBarComponent = Component.extend({
  tagName: 'progress',

  attributeBindings: ['value', 'max'],

  classNames: ['progress-bar'],

  classNameBindings: ['color'],

  @computed('progress')
  value(progress) {
    return round(progress * 100)
  },

  max: 100,

  @computed('value')
  title(value) {
    return `${value}% done`
  },

  @computed('progress')
  width(progress) {
    return htmlSafe(`width: ${progress * 100}%`)
  },

  @computed('progress')
  color(progress) {
    if (progress > 1) {
      return 'danger'
    } else if (progress >= 0.9) {
      return 'warning'
    }

    return 'success'
  }
})

ProgressBarComponent.reopenClass({
  positionalParams: ['progress']
})

export default ProgressBarComponent
