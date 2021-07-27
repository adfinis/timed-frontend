import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  isReviewer: true,

  afterCreate(projectAssignee, server) {
    const project = server.create("project");
    const user = server.create("user");
    projectAssignee.update({ project });
    projectAssignee.update({ user });
  }
});
