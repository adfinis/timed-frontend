import Component from '@ember/component'

import computed, { readOnly } from 'ember-computed-decorators'

const getDirection = state => {
  return state.startsWith('-') ? 'desc' : 'asc'
}

const getColname = state => (state.startsWith('-') ? state.substring(1) : state)

export default Component.extend({
  tagName: 'th',

  @readOnly
  @computed('current')
  direction(current) {
    return getDirection(current)
  },

  @readOnly
  @computed('current')
  active() {
    let by = this.get('by')
    let current = this.get('current')

    return getColname(current) === by
  },

  click() {
    let current = this.get('current')
    let by = this.get('by')
    let sort =
      this.get('active') && getDirection(current) === 'desc' ? by : `-${by}`

    this.get('update')(sort)
  }
})
