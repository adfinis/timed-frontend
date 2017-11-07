import Component from '@ember/component'
import { htmlSafe } from '@ember/string'
import computed from 'ember-computed-decorators'

const { PI, floor, min, abs } = Math

const { isInteger } = Number

const BalanceDonutComponent = Component.extend({
  attributeBindings: ['style'],

  classNameBindings: ['color'],

  @computed('balance.{usedDays,usedDuration,credit}')
  value(days, duration, credit) {
    if (duration || !credit) {
      return 1
    }

    return abs(days / credit)
  },

  @computed('value', 'balance.usedDuration')
  color(value, hasDuration) {
    if (hasDuration) {
      return 'primary'
    }

    if (value > 1 || value < 0) {
      return 'danger'
    }

    if (value === 1) {
      return 'warning'
    }

    return 'success'
  },

  radius: 100 / (2 * PI),

  @computed('count', 'index')
  style(count, i) {
    let mean = count / 2

    let median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])]

    let deviation = min(...median.map(m => abs(m - i)))

    let offset =
      deviation && 1 / (floor(mean) - (isInteger(mean) ? 1 : 0)) * deviation

    return htmlSafe(`--offset-multiplicator: ${offset};`)
  }
})

BalanceDonutComponent.reopenClass({
  positionalParams: ['balance']
})

export default BalanceDonutComponent
