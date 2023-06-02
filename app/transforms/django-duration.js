import Transform from "@ember-data/serializer/transform";
import { padTpl, padStart } from "ember-pad/utils/pad";
import moment from "moment";
import parseDjangoDuration from "timed/utils/parse-django-duration";

const padTpl2 = padTpl(2);
const { round } = Math;

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
export default class DjangoDurationTransform extends Transform {
  /**
   * Deserialize the django duration into a moment duration
   *
   * @method deserialize
   * @param {String} serialized The django duration
   * @return {moment.duration} The deserialized moment duration
   * @public
   */
  deserialize(serialized) {
    return parseDjangoDuration(serialized);
  }

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
    const days = Math.floor(duration.asDays());
    const milliseconds = Math.abs(moment.duration({ days }) - duration);

    const positiveDuration = moment.duration(milliseconds);

    return {
      days,
      hours: positiveDuration.hours(),
      minutes: positiveDuration.minutes(),
      seconds: positiveDuration.seconds(),
      microseconds: round(positiveDuration.milliseconds() * 1000),
    };
  }

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
      return null;
    }

    const { days, hours, minutes, seconds, microseconds } =
      this._getDurationComponentsTimedeltaLike(deserialized);

    let string = padTpl2`${hours}:${minutes}:${seconds}`;

    if (days) {
      string = `${days} ${string}`;
    }

    if (microseconds) {
      string = `${string}.${padStart(microseconds, 6)}`;
    }

    return string;
  }
}
