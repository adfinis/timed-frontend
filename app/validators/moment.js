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
    let valid = !!newValue && newValue.isValid()

    if (!valid) {
      return valid
    }

    if (options.gt) {
      let gtVal = content.get(options.gt) || changes[options.gt]

      if (newValue <= gtVal) {
        valid = false
      }
    }
    if (options.lt) {
      let ltVal = content.get(options.lt) || changes[options.lt]

      if (newValue >= ltVal) {
        valid = false
        valid = false
      }
    }

    return valid
  }
}
