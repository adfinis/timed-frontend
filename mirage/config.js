export default function() {
  this.namespace = 'api/v1'
  this.timing    = 400

  this.post('/auth/login', () => {
    return {
      token: 'someverysecurejsonwebtokenstring'
    }
  })

  this.get(  '/customers')
  this.post( '/customers')
  this.get(  '/customers/:id')
  this.patch('/customers/:id')
  this.del(  '/customers/:id')

  this.get(  '/projects')
  this.post( '/projects')
  this.get(  '/projects/:id')
  this.patch('/projects/:id')
  this.del(  '/projects/:id')

  this.get(  '/teams')
  this.post( '/teams')
  this.get(  '/teams/:id')
  this.patch('/teams/:id')
  this.del(  '/teams/:id')

  this.get(  '/users')
  this.post( '/users')
  this.get(  '/users/:id')
  this.patch('/users/:id')
  this.del(  '/users/:id')
}
