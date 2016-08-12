import ApplicationSerializer from 'timed/serializers/application'

export default ApplicationSerializer.extend({
  attrs: {
    start: 'start-datetime'
  }
})
