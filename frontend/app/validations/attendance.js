/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import { validatePresence } from "ember-changeset-validations/validators";
import validateMoment from "timed/validators/moment";

/**
 * Validations for attendances
 *
 * @class AttendanceValidations
 * @public
 */
export default {
  date: validatePresence(true),
  from: [validatePresence(true), validateMoment({ lt: "to" })],
  to: [validatePresence(true), validateMoment({ gt: "from" })],
};
