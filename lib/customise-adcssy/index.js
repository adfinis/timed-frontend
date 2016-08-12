'use strict'

module.exports = {
  name: 'customise-adcssy',

  isDevelopingAddon() {
    return true
  },

  treeForAddon() {
    let compileCSS = require('broccoli-postcss-single')

    return compileCSS(
      [ this.app.trees.styles ],
      'adcssy.css',
      'adcssy.css',
      this.app.options.postcssOptions.plugins,
      this.app.options.postcssOptions.map
    )
  }
}
