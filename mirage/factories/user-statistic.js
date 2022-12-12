import { Factory } from "ember-cli-mirage";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  duration: () => randomDuration(15, false, 20),

  afterCreate(userStatistic, server) {
    userStatistic.update({ userId: server.create("user").id });
  },
});
