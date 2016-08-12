import Transform from 'ember-data/transform'
import moment    from 'moment'

export default Transform.extend({
  format: moment.defaultFormat,

  deserialize(serialized) {
    return serialized ? moment(serialized, this.format) : null
  },

  serialize(deserialized) {
    return deserialized && deserialized.isValid() ? deserialized.format(this.format) : null
  }
})
