import { assign }                   from 'ember-platform'
import run                          from 'ember-runloop'
import Application                  from '../../app'
import config                       from '../../config/environment'
import registerBasicDropdownHelpers from 'timed/tests/helpers/ember-basic-dropdown'

registerBasicDropdownHelpers()

export default function startApp(attrs) {
  let application

  // use defaults, but you can override
  let attributes = assign({}, config.APP, attrs)

  run(() => {
    application = Application.create(attributes)
    application.setupForTesting()
    application.injectTestHelpers()
  })

  return application
}
