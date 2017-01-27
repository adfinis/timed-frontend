/* global require, module */

'use strict'

let EmberApp = require('ember-cli/lib/broccoli/ember-app')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [ 'bower_components/adcssy/css' ],
      onlyIncluded: true
    },
    postcssOptions: {
      compile: {
        enabled: false
      },
      filter: {
        enabled: true,
        map: { inline: false },
        plugins: [
          {
            module: require('postcss-cssnext'),
            options: {
              browsers: [ '>1%' ]
            }
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

  return app.toTree()
}
