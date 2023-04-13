import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import moment from "moment";

export default class UsersIndexRoute extends Route {
  @service session;
  @service store;

  queryParams = {
    search: {
      refreshModel: true,
      replace: true,
    },
    supervisor: {
      refreshModel: true,
      replace: true,
    },
    active: {
      refreshModel: true,
      replace: true,
    },
    ordering: {
      refreshModel: true,
      replace: true,
    },
  };

  async model(params) {
    try {
      const date = moment().format("YYYY-MM-DD");

      await this.store.query("employment", { date });
      await this.store.query("worktime-balance", { date });

      const data = await this.store.query("user", {
        ...params,
        ...(this.session.data.user.isSuperuser
          ? {}
          : {
              supervisor: this.session.data.user.id,
            }),
      });
      return { value: data };
    } catch (error) {
      return { isError: true };
    }
  }
}
