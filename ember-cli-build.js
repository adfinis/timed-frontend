/* global require, module */

'use strict'

let EmberApp = require('ember-cli/lib/broccoli/ember-app')
let funnel   = require('broccoli-funnel')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      plugins: [
        {
          module: require('postcss-import'),
          options: {
            path: [
              'bower_components/adcssy/css',
              'bower_components'
            ]
          }
        },
        {
          module: require('postcss-cssnext'),
          options: {
            features: { rem: false, customProperties: true },
            browsers: 'last 2 Firefox version, last 2 Chrome versions'
          }
        },
        {
          module: require('postcss-responsive-type')
        }
      ]
    },
    babel: {
      includePolyfill: true,
      optional: [
        'es7.decorators',
        'asyncToGenerator'
      ]
    },
    'ember-cli-qunit': {
      useLintTree: false
    },
    SRI: {
      paranoiaCheck: true
    }
  })

  let fonts = funnel('bower_components/adcssy/assets/fonts', {
    destDir: '/fonts'
  })

  return app.toTree([ fonts ])
}
