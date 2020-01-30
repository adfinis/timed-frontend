/* global require, module */

'use strict'

const EmberApp = require('ember-cli/lib/broccoli/ember-app')
const Funnel = require('broccoli-funnel')

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      onlyIncluded: true
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

  let fonts = new Funnel('node_modules/typeface-source-sans-pro/files', {
    include: ['*.woff', '*.woff2'],
    destDir: '/assets/files/'
  })

  return app.toTree([fonts])
}
