/* global require, module */

'use strict'

let EmberApp = require('ember-cli/lib/broccoli/ember-app')
let funnel   = require('broccoli-funnel')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      filter: {
        enabled: false
      },
      compile: {
        enabled: true,
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: [ 'bower_components' ]
            }
          },
          {
            module: require('postcss-cssnext')
          }
        ]
      }
    },
    babel: {
      includePolyfill: true,
      optional: [ 'es7.asyncFunctions', 'es7.decorators' ]
    }
  })

  app.import('bower_components/elessar/dist/elessar.js')
  app.import('bower_components/elessar/elessar.css')

  app.import('bower_components/adcssy/build/css/adcssy.css')

  let fonts = funnel('bower_components/adcssy/assets/fonts', {
    destDir: '/fonts'
  })

  return app.toTree([ fonts ])
}
