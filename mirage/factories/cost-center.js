import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  name: () => faker.finance.accountName(),
  reference: () => faker.finance.account()
});
