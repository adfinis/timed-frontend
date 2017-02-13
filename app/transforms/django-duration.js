/**
 * @module timed
 * @submodule timed-transforms
 * @public
 */
import Transform from 'ember-data/transform'
import moment    from 'moment'

import {
  padTpl
} from 'ember-pad/utils/pad'

const padTpl2 = padTpl(2)

/**
 * The django duration transform
 *
 * This transforms a django duration into a moment duration
 *
 * @class DjangoDurationTransform
 * @extends DS.Transform
 * @public
 */
export default Transform.extend({
  /**
   * Deserialize the django duration into a moment duration
   *
   * @method deserialize
   * @param {String} serialized The django duration
   * @return {moment.duration} The deserialized moment duration
   * @public
   */
  deserialize(serialized) {
    if (!serialized) {
      return null
    }

    let [ hours, minutes, seconds ] = serialized.split(':').map(Number)

    return moment.duration({ hours, minutes, seconds })
  },

  /**
   * Serialize the moment duration into a django duration
   *
   * @method serialize
   * @param {moment.duration} deserialized The moment duration
   * @return {String} The serialized django duration
   * @public
   */
  serialize(deserialized) {
    if (!moment.isDuration(deserialized)) {
      return null
    }

    let hours   = Math.floor(deserialized.asHours())
    let minutes = deserialized.minutes()
    let seconds = deserialized.seconds()

    return padTpl2`${hours}:${minutes}:${seconds}`
  }
})
