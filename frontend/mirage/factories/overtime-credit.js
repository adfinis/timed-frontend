import { Factory } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => moment().format("YYYY-MM-DD"),
  duration: () => randomDuration(),
  comment: () => faker.lorem.sentence(),
});
