import { Factory, association } from "ember-cli-mirage";
import faker from "faker";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  name: () => faker.commerce.productName(),
  estimatedTime: () => randomDuration(),
  // customer: association()
  billingType: association(),

  afterCreate(project, server) {
    project.update({ customerId: server.create("customer").id });
  },
});
