/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'timed',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    moment: {
      includeTimezone: 'all'
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      REPORTEXPORTS: [
        {
          label: 'CSV',
          url: '/api/v1/reports/export',
          params: {
            file_type: 'csv'
          }
        },
        {
          label: 'ODS',
          url: '/api/v1/reports/export',
          params: {
            file_type: 'ods'
          }
        },
        {
          label: 'XLSX',
          url: '/api/v1/reports/export',
          params: {
            file_type: 'xlsx'
          }
        },
        {
          label: 'Work report',
          url: '/api/v1/work-reports',
          params: {}
        }
      ]
    },

    'ember-simple-auth': {
      authorizer: 'authorizer:token'
    },

    'ember-validated-form': {
      css: {
        // adcssy classes
        group: 'form-group',
        control: 'form-control',
        label: 'form-label',
        checkbox: 'checkbox',
        radio: 'radio',
        help: 'error-text',
        button: 'btn btn-default',
        submit: 'btn btn-primary',
        loading: 'loading'
      }
    }
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'

    ENV['ember-tether'] = {
      bodyElementId: 'ember-testing'
    }
  }

  if (environment === 'production') {
  }

  return ENV
}
