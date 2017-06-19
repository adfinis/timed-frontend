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
      plugins: [
        'transform-async-generator-functions',
        'transform-decorators-legacy',
        'transform-object-rest-spread'
      ]
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-aupac-typeahead': {
      includeTypeahead: false
    }
  })

  app.import('bower_components/corejs-typeahead/dist/typeahead.jquery.js')

  return app.toTree()
}
