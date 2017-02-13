import Ember            from 'ember'
import Application      from 'ember-application'
import Resolver         from './resolver'
import loadInitializers from 'ember-load-initializers'
import config           from './config/environment'
import RSVP             from 'rsvp'

const { Promise } = RSVP

window.NativePromise = window.Promise
window.Promise = Promise

Ember.MODEL_FACTORY_INJECTIONS = true

let App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
})

loadInitializers(App, config.modulePrefix)

export default App
