import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  name: () => faker.address.city(),
  workdays: () => ["1", "2", "3", "4", "5"],
});
