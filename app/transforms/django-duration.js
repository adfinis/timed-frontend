/**
 * @module timed
 * @submodule timed-transforms
 * @public
 */
import Transform from 'ember-data/transform'
import moment    from 'moment'

import {
  padTpl,
  padStart
} from 'ember-pad/utils/pad'

const padTpl2   = padTpl(2)
const { round } = Math

/**
 * The django duration transform
 *
 * This transforms a django duration into a moment duration
 *
 * Django formats the timedelta like this: `DD HH:MM:ss.uuuuuu`. However,
 * days and microseconds are optional.
 *
 * @see http://www.django-rest-framework.org/api-guide/fields/#durationfield
 * @see https://github.com/django/django/blob/master/django/utils/duration.py
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

    let re = new RegExp(/^(\-?\d\s)?(\d{2}):(\d{2}):(\d{2})(\.\d{6})?$/)

    let [
      ,
      days,
      hours,
      minutes,
      seconds,
      microseconds
    ] = serialized.match(re).map((m) => Number(m) || 0)

    return moment.duration({
      days,
      hours,
      minutes,
      seconds,
      milliseconds: microseconds * 1000
    })
  },

  /**
   * Get the duration components from the duration like pythons timedelta does
   * it.
   *
   * This means that a duration of -1 hour becomes a duration of -1 day +23
   * hours, so we never have a negative hour, minute, second or millisecond.
   * ONLY days can be negative!
   *
   * @method _getDurationComponentsTimedeltaLike
   * @param {moment.duration} duration The duration to parse
   * @returns {Object} An object containing all needed components as number
   * @private
   */
  _getDurationComponentsTimedeltaLike(duration) {
    let days         = Math.floor(duration.asDays())
    let milliseconds = Math.abs(moment.duration({ days }) - duration)

    let positiveDuration = moment.duration(milliseconds)

    return {
      days,
      hours: positiveDuration.hours(),
      minutes: positiveDuration.minutes(),
      seconds: positiveDuration.seconds(),
      microseconds: round(positiveDuration.milliseconds() * 1000)
    }
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

    let {
      days,
      hours,
      minutes,
      seconds,
      microseconds
    } = this._getDurationComponentsTimedeltaLike(deserialized)

    let string = padTpl2`${hours}:${minutes}:${seconds}`

    if (days) {
      string = `${days} ${string}`
    }

    if (microseconds) {
      string = `${string}.${padStart(microseconds, 6)}`
    }

    return string
  }
})
