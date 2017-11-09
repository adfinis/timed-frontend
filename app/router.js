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
    this.route('users', { resetNamespace }, function() {
      this.route('edit', { path: '/:user_id' }, function() {
        this.route('credits', function() {
          this.route('overtime-credits', function() {
            this.route('edit', { path: '/:overtime_credit_id' })
            this.route('new')
          })
          this.route('absence-credits', function() {
            this.route('edit', { path: '/:absence_credit_id' })
            this.route('new')
          })
        })
        this.route('responsibilities')
      })
    })
    this.route('notfound', { resetNamespace, path: '/*path' })
  })
})

export default ApplicationRouter
