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

    this.route('projects', { resetNamespace }, function() {
      this.route('edit', { path: '/:id' }, function() {
        this.route('tasks')
        this.route('tracker')
      })
      this.route('new')
    })

    this.route('customers', { resetNamespace }, function() {
      this.route('edit', { path: '/:id' })
      this.route('new')
    })

    this.route('task-templates', { resetNamespace }, function() {
      this.route('edit', { path: '/:id' })
      this.route('new')
    })

    this.route('users', { resetNamespace }, function() {
      this.route('detail', { path: '/:id' })
    })

    this.route('about',      { resetNamespace })
    this.route('sick-days',  { resetNamespace })
    this.route('school',     { resetNamespace })
    this.route('holidays',   { resetNamespace })
    this.route('overview',   { resetNamespace })
  })
})

export default ApplicationRouter
