import { helper } from "@ember/component/helper";
import faker from "faker";

/**
 * Helper to generate a unique id. This helper must be deleted when updating to ember 4.4, as
 * it will ship its built-in unique-id helper function.
 *
 * @function uniqueId
 * @return {String} A unique id
 * @public
 */
export function uniqueId() {
  return faker.random.uuid();
}

export default helper(uniqueId);
