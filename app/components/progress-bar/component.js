import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import { htmlSafe } from 'ember-string'

const { round } = Math

const ProgressBarComponent = Component.extend({
  tagName: 'progress',

  attributeBindings: ['value', 'max'],

  classNames: ['progress-bar'],

  classNameBindings: ['color'],

  color: null,

  @computed('progress')
  value(progress) {
    return round(progress * 100)
  },

  max: 100,

  @computed('progress')
  width(progress) {
    return htmlSafe(`width: ${progress * 100}%`)
  }
})

ProgressBarComponent.reopenClass({
  positionalParams: ['progress']
})

export default ProgressBarComponent
