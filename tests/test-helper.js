import resolver from './helpers/resolver'
import { setResolver } from 'ember-mocha'
import Application from '../app'
import config from '../config/environment'
import { setApplication } from '@ember/test-helpers'
import { mocha } from 'mocha'

mocha.setup({ timeout: 10000, slow: 1000 })

setResolver(resolver)
setApplication(Application.create(config.APP))
