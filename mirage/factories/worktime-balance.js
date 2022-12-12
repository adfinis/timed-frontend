import { Factory } from "ember-cli-mirage";
import moment from "moment";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => moment(),
  balance: () => randomDuration(),
});
