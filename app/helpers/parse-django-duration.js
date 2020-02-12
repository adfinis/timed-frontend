/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper } from "@ember/component/helper";
import parseDjangoDuration from "timed/utils/parse-django-duration";

/**
 * The parse django duration helper
 *
 * @function parseDjangoDurationFn
 * @param {Array} args The arguments delivered to the helper
 * @return {moment.duration} The moment duration
 * @public
 */
export const parseDjangoDurationFn = args => parseDjangoDuration(...args);

export default helper(parseDjangoDurationFn);
