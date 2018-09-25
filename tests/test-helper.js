import resolver from './helpers/resolver'
import { setResolver } from 'ember-mocha'
import { mocha } from 'mocha'

mocha.setup({
  timeout: 100000,
  slow: 1000
})

setResolver(resolver)
