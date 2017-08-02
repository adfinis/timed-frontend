/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper } from 'ember-helper'

/**
 * Helper to determine the color of a balance
 *
 * > 0: red-ish
 * < 0: green-ish
 *
 * @function balanceHighlightClass
 * @param {Array} options The options delivered to the helper
 * @return {String} The CSS class to apply the color
 * @public
 */
export function balanceHighlightClass([balance]) {
  if (balance.asMinutes() > 0) {
    return 'color-success'
  } else if (balance.asMinutes() < 0) {
    return 'color-danger'
  }

  return ''
}

export default helper(balanceHighlightClass)
