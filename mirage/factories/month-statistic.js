import { Factory } from "ember-cli-mirage";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  year: i => 2010 + Math.ceil((i + 1) / 12),
  month: i => (i % 12) + 1,
  duration: () => randomDuration(15, false, 20)
});
