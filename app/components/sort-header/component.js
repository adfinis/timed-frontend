import Component from '@ember/component'
import { computed } from '@ember/object'

const getDirection = state => {
  return state.startsWith('-') ? 'desc' : 'asc'
}

const getColname = state => (state.startsWith('-') ? state.substring(1) : state)

export default Component.extend({
  tagName: 'th',

  direction: computed('current', function() {
    return getDirection(this.get('current'))
  }).readOnly(),

  active: computed('current', function() {
    let by = this.get('by')
    let current = this.get('current')

    return getColname(current) === by
  }).readOnly(),

  click() {
    let current = this.get('current')
    let by = this.get('by')
    let sort =
      this.get('active') && getDirection(current) === 'desc' ? by : `-${by}`

    this.get('update')(sort)
  }
})
