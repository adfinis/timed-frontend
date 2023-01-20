import { Factory, association, trait } from "ember-cli-mirage";
import faker from "faker";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  name: () => faker.commerce.productName(),
  estimatedTime: () => randomDuration(),

  afterCreate(project, server) {
    project.update({ customerId: server.create("customer").id });
  },

  withBillingType: trait({
    billingType: association(),
  }),
});
