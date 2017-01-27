import ApplicationSerializer from 'timed/serializers/application'

export default ApplicationSerializer.extend({
  attrs: {
    from: 'from-datetime',
    to: 'to-datetime'
  }
})
