import { get } from "@ember/object";
import moment from "moment";

function getDateTimeIfValid(momentObject) {
  if (momentObject && momentObject._isValid) {
    return momentObject;
  }
  return undefined;
}

/**
 * Validator to determine if a value is a valid moment object and if it is
 * greater or smaller than another property of the content.
 *
 * @function validateMoment
 * @param {Object} options The configuration options
 * @param {String} options.gt The value to check whether it is greater
 * @param {String} options.lt The value to check whether it is less
 * @return {Boolean} Whether the value is valid
 * @public
 */
export default function validateMoment(options = { gt: null, lt: null }) {
  return (key, newValue, oldValue, changes, content) => {
    if (!newValue && content.active) {
      newValue = moment();
    }
    let valid = !!newValue && newValue._isValid;
    if (!valid) {
      return "The given value is not a valid value";
    }

    if (options.gt) {
      const gtVal =
        getDateTimeIfValid(get(changes, options.gt)) ||
        getDateTimeIfValid(get(content, options.gt)) ||
        moment();
      if (newValue <= gtVal) {
        valid = `The value is smaller than ${options.gt}`;
      }
    }
    if (options.lt) {
      const ltVal =
        getDateTimeIfValid(get(changes, options.lt)) ||
        getDateTimeIfValid(get(content, options.lt)) ||
        moment();

      if (newValue >= ltVal) {
        valid = `The valus is larger than ${options.lt}`;
      }
    }
    return valid;
  };
}
