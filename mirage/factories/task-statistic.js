import { Factory } from "ember-cli-mirage";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  duration: () => randomDuration(15, false, 20),

  afterCreate(taskStatistic, server) {
    taskStatistic.update({ taskId: server.create("task").id });
  }
});
