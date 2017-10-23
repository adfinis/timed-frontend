/* global require, module */

'use strict'

const EmberApp = require('ember-cli/lib/broccoli/ember-app')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ['bower_components/adcssy/css'],
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
              browsers: ['>1%'],
              features: {
                customProperties: {
                  warnings: false
                }
              }
            }
          }
        ]
      }
    },
    babel: {
      plugins: [
        'transform-async-to-generator',
        'transform-decorators-legacy',
        'transform-object-rest-spread'
      ]
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    dotEnv: {
      clientAllowedKeys: ['TIMED_REPORT_EXPORT']
    },
    'ember-site-tour': {
      importHopscotchJS: true,
      importHopscotchCSS: true
    }
  })

  return app.toTree()
}
