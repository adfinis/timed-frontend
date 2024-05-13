import Service, { inject as service } from "@ember/service";
import moment from "moment";

export default class CurrentUserService extends Service {
  @service session;
  @service fetch;
  @service store;
  @service router;

  async load() {
    if (!this.session.isAuthenticated) {
      return;
    }
    const user = await this.fetch.fetch(
      `/api/v1/users/me?${new URLSearchParams({
        include: "supervisors,supervisees",
      })}`,
      {
        method: "GET",
      }
    );

    await this.store.pushPayload("user", user);

    const usermodel = await this.store.peekRecord("user", user.data.id);

    // Fetch current employment
    const employment = await this.store.query("employment", {
      user: usermodel.id,
      date: moment().format("YYYY-MM-DD"),
      include: "location",
    });

    if (!employment.length) {
      this.router.transitionTo("no-access");
    }

    this.user = usermodel;
  }
}
