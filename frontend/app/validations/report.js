/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import { validatePresence } from "ember-changeset-validations/validators";

/**
 * Validations for reports
 *
 * @class ReportValidations
 * @public
 */
export default {
  /**
   * Task validator, check if a task is existent
   *
   * @property {Function} task
   * @public
   */
  task: validatePresence(true),

  /**
   * Duration validator, check if a duration is existent
   *
   * @property {Function} duration
   * @public
   */
  duration: validatePresence(true),
};
