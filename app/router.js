import Router from 'ember-router'
import config from './config/environment'

const ApplicationRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

const resetNamespace = true

/* eslint-disable max-nested-callbacks */
ApplicationRouter.map(function() {
  this.route('login')

  this.route('protected', { path: '/' }, function() {
    this.route('index', { resetNamespace, path: '/' })
  })
})

export default ApplicationRouter
