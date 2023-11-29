import Service from "@ember/service";

class SessionMock extends Service {
  isAuthenticated = true;
  headers = {
    authorization: "Bearer TEST1234",
  };
}

export default function setupSession(hooks) {
  hooks.beforeEach(async function () {
    this.owner.register("service:session", SessionMock);
  });
}
