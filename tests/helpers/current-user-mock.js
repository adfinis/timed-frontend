import Service from "@ember/service";

class CurrentUserMock extends Service {}

export default function setupCurrentUser(hooks) {
  hooks.beforeEach(async function () {
    this.owner.register("service:currentUser", CurrentUserMock);
  });
}
