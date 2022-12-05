import { Factory } from "ember-cli-mirage";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  duration: () => randomDuration(15, false, 20),

  afterCreate(projectStatistic, server) {
    projectStatistic.update({ projectId: server.create("project").id });
  },
});
