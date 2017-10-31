import Router from '@ember/routing/router'
import config from './config/environment'

const ApplicationRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

const resetNamespace = true

ApplicationRouter.map(function() {
  this.route('login')

  this.route('protected', { path: '/' }, function() {
    this.route('index', { resetNamespace, path: '/' }, function() {
      this.route('activities', { path: '/' }, function() {
        this.route('edit', { path: '/edit/:id' })
      })
      this.route('attendances')
      this.route('reports')
    })
    this.route('statistics', { resetNamespace })
    this.route('me', { resetNamespace })
    this.route('analysis', { resetNamespace })
    this.route('reschedule', { resetNamespace })
    this.route('users', { resetNamespace }, function() {
      this.route('edit', { path: '/:id' }, function() {})
    })
    this.route('notfound', { resetNamespace, path: '/*path' })
  })
})

export default ApplicationRouter
