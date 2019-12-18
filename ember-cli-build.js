/* global require, module */

'use strict'

const EmberApp = require('ember-cli/lib/broccoli/ember-app')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      onlyIncluded: true
    },
    postcssOptions: {
      compile: { enabled: false },
      filter: {
        enabled: true,
        plugins: [
          {
            module: require('postcss-cssnext'),
            options: {
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
      plugins: ['@babel/plugin-proposal-object-rest-spread']
    },
    'ember-site-tour': {
      importHopscotchJS: true,
      importHopscotchCSS: true
    }
  })

  app.import('vendor/adcssy.min.css')

  app.import('node_modules/downloadjs/download.min.js', {
    using: [{ transformation: 'amd', as: 'downloadjs' }]
  })

  app.import('node_modules/intersection-observer/intersection-observer.js')

  return app.toTree()
}
