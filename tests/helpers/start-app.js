import Ember       from 'ember'
import { assign }  from 'ember-platform'
import Application from '../../app'
import config      from '../../config/environment'
import run         from 'ember-runloop'

export default function startApp(attrs) {
  let application

  // disable the deprecation warnings
  Ember.deprecate = () => {}

  // use defaults, but you can override
  let attributes = assign({}, config.APP, attrs)

  run(() => {
    application = Application.create(attributes)
    application.setupForTesting()
    application.injectTestHelpers()
  })

  return application
}
